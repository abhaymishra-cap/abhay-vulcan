const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock-api/db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Enable CORS for all routes
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CAP-REMOTE-USER, X-CAP-API-AUTH-ORG-ID');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parser middleware
server.use(jsonServer.bodyParser);

// Custom route for GET /api/v1/categories (v2 API structure)
server.get('/api/v1/categories', (req, res) => {
  const categories = router.db.get('categories').value();
  let filtered = [...categories];

  // Apply search filter (q parameter) - case-insensitive search by code/name
  if (req.query.q) {
    const search = req.query.q.toLowerCase();
    filtered = filtered.filter(cat =>
      (cat.code && cat.code.toLowerCase().includes(search)) ||
      (cat.name && cat.name.toLowerCase().includes(search))
    );
  }

  // Apply root filter (only root-level categories with no parent)
  if (req.query.root === 'true') {
    filtered = filtered.filter(cat => cat.parent === null);
  }

  // Apply entityCodes filter (comma-separated category codes)
  if (req.query.entityCodes) {
    const codes = req.query.entityCodes.split(',').map(c => c.trim().toLowerCase());
    filtered = filtered.filter(cat => 
      cat.code && codes.includes(cat.code.toLowerCase())
    );
  }

  // Apply entityIds filter (comma-separated category IDs)
  if (req.query.entityIds) {
    const ids = req.query.entityIds.split(',').map(id => {
      const parsed = parseInt(id.trim());
      return isNaN(parsed) ? id.trim() : parsed;
    });
    filtered = filtered.filter(cat => ids.includes(cat.id));
  }

  // Apply sorting
  const sortBy = req.query.sortBy || 'id';
  const sortOrder = req.query.sortOrder || 'ASC';
  
  if (sortBy === 'id') {
    filtered.sort((a, b) => {
      const comparison = a.id - b.id;
      return sortOrder === 'DESC' ? -comparison : comparison;
    });
  } else if (sortBy === 'code') {
    filtered.sort((a, b) => {
      const aCode = (a.code || '').toLowerCase();
      const bCode = (b.code || '').toLowerCase();
      const comparison = aCode.localeCompare(bCode);
      return sortOrder === 'DESC' ? -comparison : comparison;
    });
  }

  // Apply pagination (offset/limit)
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const start = offset;
  const end = start + limit;

  const paginated = filtered.slice(start, end);

  // Format response to match v2 API structure: { data: [...], pagination: {...} }
  res.json({
    data: paginated,
    pagination: {
      limit: limit,
      offset: offset,
      total: filtered.length,
    },
  });
});

// Custom route for GET /api/v1/categories/:id (v2 API structure)
server.get('/api/v1/categories/:id', (req, res) => {
  const categoryId = parseInt(req.params.id) || req.params.id;
  const category = router.db.get('categories').find({ id: categoryId }).value();

  if (!category) {
    return res.status(404).json({
      message: 'Category not found',
    });
  }

  // Handle includeChildren parameter
  let responseData = { ...category };
  if (req.query.includeChildren === 'true') {
    const categories = router.db.get('categories').value();
    const children = categories.filter(cat => 
      cat.parent && cat.parent.id === categoryId
    );
    
    const childrenLimit = parseInt(req.query.childrenLimit) || 10;
    const childrenOffset = parseInt(req.query.childrenOffset) || 0;
    const paginatedChildren = children.slice(childrenOffset, childrenOffset + childrenLimit);
    
    responseData.children = paginatedChildren.map(child => ({
      id: child.id,
      code: child.code,
      name: child.name,
    }));
  }

  res.json({
    data: responseData,
  });
});

// Custom route for POST /api/v1/categories (v2 API structure)
server.post('/api/v1/categories', (req, res) => {
  const categories = router.db.get('categories').value();
  
  // Generate new numeric ID
  const lastId = categories.length > 0 
    ? Math.max(...categories.map(cat => typeof cat.id === 'number' ? cat.id : 0))
    : 10173900;
  const newId = lastId + 1;

  // Find parent category object if parentId is provided
  let parent = null;
  if (req.body.parentId) {
    const parentCategory = categories.find(cat => cat.id === req.body.parentId);
    if (parentCategory) {
      parent = {
        id: parentCategory.id,
        code: parentCategory.code,
        name: parentCategory.name,
      };
    }
  }

  const newCategory = {
    id: newId,
    orgId: 50583,
    ouId: -1,
    code: req.body.code || req.body.name.toLowerCase().replace(/\s+/g, '-'),
    name: req.body.name,
    description: req.body.description || '',
    parent: parent,
    attribution: {
      createdBy: 15000449,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    },
  };

  router.db.get('categories').push(newCategory).write();

  res.status(201).json({
    data: newCategory,
  });
});

// Custom route for PUT /api/v1/categories/:id (v2 API structure)
server.put('/api/v1/categories/:id', (req, res) => {
  const categoryId = parseInt(req.params.id) || req.params.id;
  const category = router.db.get('categories').find({ id: categoryId }).value();

  if (!category) {
    return res.status(404).json({
      message: 'Category not found',
    });
  }

  // Find parent category object if parentId is being updated
  let parent = category.parent;
  if (req.body.parentId !== undefined) {
    if (req.body.parentId === null) {
      parent = null;
    } else {
      const categories = router.db.get('categories').value();
      const parentCategory = categories.find(cat => cat.id === req.body.parentId);
      if (parentCategory) {
        parent = {
          id: parentCategory.id,
          code: parentCategory.code,
          name: parentCategory.name,
        };
      }
    }
  }

  const updatedCategory = {
    ...category,
    code: req.body.code !== undefined ? req.body.code : category.code,
    name: req.body.name !== undefined ? req.body.name : category.name,
    description: req.body.description !== undefined ? req.body.description : category.description,
    parent: parent,
    attribution: {
      ...category.attribution,
      modifiedDate: new Date().toISOString(),
    },
  };

  router.db.get('categories').find({ id: categoryId }).assign(updatedCategory).write();

  res.json({
    data: updatedCategory,
  });
});

// Custom route for DELETE /api/v1/categories/:id (v2 API structure)
server.delete('/api/v1/categories/:id', (req, res) => {
  const categoryId = parseInt(req.params.id) || req.params.id;
  const category = router.db.get('categories').find({ id: categoryId }).value();

  if (!category) {
    return res.status(404).json({
      message: 'Category not found',
    });
  }

  // Check if category has children
  const categories = router.db.get('categories').value();
  const hasChildren = categories.some(cat => 
    cat.parent && cat.parent.id === categoryId
  );

  if (hasChildren) {
    return res.status(400).json({
      message: 'Cannot delete category with subcategories',
      error: {
        code: 'CATEGORY_HAS_CHILDREN',
      },
    });
  }

  router.db.get('categories').remove({ id: categoryId }).write();

  res.status(200).json({
    message: 'Category deleted successfully',
  });
});

// Use default router for other routes
server.use('/api/v1', router);

// Start server
const PORT = process.env.MOCK_API_PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 JSON Server is running on http://localhost:${PORT}`);
  console.log(`📁 Database: mock-api/db.json`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    http://localhost:${PORT}/api/v1/categories`);
  console.log(`  GET    http://localhost:${PORT}/api/v1/categories/:id`);
  console.log(`  POST   http://localhost:${PORT}/api/v1/categories`);
  console.log(`  PUT    http://localhost:${PORT}/api/v1/categories/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/v1/categories/:id\n`);
});

