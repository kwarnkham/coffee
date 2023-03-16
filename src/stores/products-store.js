import { defineStore } from 'pinia';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: []
  }),

  getters: {
    getProducts (state) {
      return state.products
    }
  },

  actions: {
    setProducts (payload) {
      this.products = payload
    }
  }
})
