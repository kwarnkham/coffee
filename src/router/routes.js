
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
        name: 'inventory-item',
        meta: {
          role: "sale",
          requiresAuth: true
        }
      },
      {
        path: 'cart',
        component: () => import('pages/OrderDetails.vue'),
        name: 'cart',
        meta: {
          role: "sale",
          requiresAuth: true
        }
      },
      {
        path: 'order/:order',
        component: () => import('pages/OrderDetails.vue'),
        name: 'order-details',
        meta: {
          role: "sale",
          requiresAuth: true
        }
      },
      {
        path: 'order',
        component: () => import('pages/OrderList.vue'),
        name: 'order',
        meta: {
          role: "sale",
          requiresAuth: true
        }
      },
      {
        path: 'item-order',
        component: () => import('pages/ItemOrder.vue'),
        name: 'item-order',
        meta: {
          role: "sale",
          requiresAuth: true
        }
      },
      {
        path: 'expense',
        component: () => import('pages/ExpensePage.vue'),
        name: 'expense',
        meta: {
          role: "sale",
          requiresAuth: true
        }
      },
      {
        path: 'expense-type',
        component: () => import('pages/ExpenseType.vue'),
        name: 'expense-type',
        meta: {
          role: "sale",
          requiresAuth: true
        }
      },
      {
        path: 'users',
        component: () => import('pages/UsersPage.vue'),
        name: 'users',
        meta: {
          role: "admin",
          requiresAuth: true
        }
      },
      {
        path: 'customers',
        component: () => import('pages/CustomersPage.vue'),
        name: 'customers',
        meta: {
          role: "sale",
          requiresAuth: true
        }
      },
      {
        path: 'change-password',
        component: () => import('pages/ChangePassword.vue'),
        name: 'change-password',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'customer-details',
        component: () => import('pages/CustomerDetails.vue'),
        name: 'customer-details',
        meta: {
          requiresAuth: true
        }
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
