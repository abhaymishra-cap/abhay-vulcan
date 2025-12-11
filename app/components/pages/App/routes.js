import { lazy } from 'react';
const Dashboard = lazy(() => import('../Dashboard/Loadable'));
const Home = lazy(() => import('../Home/Loadable'));
const About = lazy(() => import('../About/Loadable'));
const Contact = lazy(() => import('../Contact/Loadable'));
const Categories = lazy(() => import('../Categories/Loadable'));
const Brands = lazy(() => import('../Brands/Loadable'));
const Products = lazy(() => import('../Products/Loadable'));

const routes = [
  // remove these dummy routes and add your own routes
  {
    path: `/home`,
    component: Home,
    routes: [
      {
        exact: true,
        path: `/home/about`,
        component: About,
      },
      {
        exact: true,
        path: `/home/contact`,
        component: Contact,
      },
    ],
  },
  {
    exact: true,
    path: `/accessForbidden`,
    component: lazy(() => import('@capillarytech/vulcan-react-sdk/components/AccessForbidden')),
  },
  {
    exact: true,
    path: `/categories`,
    component: Categories,
  },
  {
    exact: true,
    path: `/brands`,
    component: Brands,
  },
  {
    exact: true,
    path: `/products`,
    component: Products,
  },
  // this will be your default / home / landing page route
  {
    exact: true,
    path: `/*`,
    component: Dashboard,
  },
];

export default routes;
