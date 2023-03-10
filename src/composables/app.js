import { useCartStore } from "src/stores/cart-store";

export default function useApp () {
  const cartStore = useCartStore()
  const getCartQuantity = (product) => {
    return cartStore.getCart.products.filter((e) => e.id == product.id).reduce((carry, val) => carry + val.quantity, 0);

  };

  return {
    getCartQuantity
  }
}
