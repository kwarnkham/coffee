import { LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    const token = LocalStorage.getItem('token')
    const user = LocalStorage.getItem('user')
    const index = user?.roles?.findIndex(role => role.name == to.meta.role);

    if (to.meta.requiresAuth && !token) {
      console.log('no token')
      next({ name: 'index' })
    }
    else if (to.meta.role && index <= -1) {
      console.log('role', user)
      next({ name: 'index' })
    }
    else next()
  })
})
