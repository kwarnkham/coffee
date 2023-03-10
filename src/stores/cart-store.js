import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {
      products: LocalStorage.getItem('products') ?? [],
      discount: LocalStorage.getItem('discount') ?? 0,
    }
  }),
  getters: {
    getCart: (state) => state.cart,
  },
  actions: {
    addProduct ({ product, quantity }) {
      product = JSON.parse(JSON.stringify(product))
      product.quantity = Number(quantity);
      const existed = this.cart.products.findIndex(
        e => e.id == product.id &&
          (!e.toppings || e.toppings.length == 0)
      );
      if (existed == -1) this.cart.products.push(product)
      else this.cart.products[existed].quantity += product.quantity
      LocalStorage.set('products', this.cart.products)
    },
    applyDiscount (value) {
      this.cart.discount = Number(value)
      LocalStorage.set('discount', this.cart.discount)
    },
    updateProduct (product, index) {
      product = JSON.parse(JSON.stringify(product))
      if (product.quantity <= 0) this.cart.products.splice(index, 1)
      else this.cart.products[index] = product
      LocalStorage.set('products', this.cart.products)
    },
    clear () {
      this.cart.products = []
      this.cart.discount = 0
      LocalStorage.set('products', this.cart.products)
      LocalStorage.set('discount', this.cart.discount)
    },
  },
});
