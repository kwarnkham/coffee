
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'index'
      },
      {
        path: 'inventory-item',
        component: () => import('pages/InventoryItem.vue'),
        name: 'inventory-item'
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        name: 'login'
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
