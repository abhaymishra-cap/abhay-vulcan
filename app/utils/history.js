/**
 * Hash history instance for SPA routing
 * Using hash-based routing to work without server configuration
 * URLs will be like: /abhay/ui/#/categories
 */
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

export default history;

