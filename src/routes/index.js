/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */

export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard/Index'),

      // If the user needs to be authenticated to view this page
    meta: {
      auth: true,
    },
  },

  {
    path: '/comenzi',
    name: 'comenzi',
    component: () => import('@/pages/Comenzi/Index'),

        // If the user needs to be authenticated to view this page
    meta: {
      auth: true,
    },
  },

  {
    path: '/parc-auto',
    name: 'parcauto',
    component: () => import('@/pages/ParcAuto/Index'),

    meta: {
      auth: true,
    },
  },

  {
    path: '/soferi',
    name: 'soferi',
    component: () => import('@/pages/Soferi/Index'),

    meta: {
      auth: true,
    },
  },

  // Planificare route
  {
    path: '/planificare',
    name: 'planificare',
    component: () => import('@/pages/Harta/Index'),

    meta: {
      auth: true,
    },
  },

  // Login
  {
    path: '/login',
    name: 'login.index',
    component: () => import('@/pages/Login/Index'),

    // If the user needs to be a guest to view this page.
    meta: {
      guest: true,
    },
  },

  // Register
  {
    path: '/register',
    name: 'register.index',
    component: () => import('@/pages/Register/Index.vue'),

    // If the user needs to be a guest to view this page.
    meta: {
      guest: true,
    },
  },

  {
    path: '/',
    redirect: '/home',
  },

  {
    path: '/*',
    redirect: '/home',
  },
];
