import { defineStore } from 'pinia';

export const useRoleStore = defineStore('roleStore', {
  state: () => ({
    roles: []
  }),

  getters: {
    getRoles (state) {
      return state.roles
    }
  },

  actions: {
    setRoles (payload) {
      this.roles = payload
    }
  }
})
