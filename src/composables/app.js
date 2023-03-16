import { useQuasar } from "quasar";
import { useCartStore } from "src/stores/cart-store";

export default function useApp () {
  const cartStore = useCartStore()
  const { dialog } = useQuasar();
  const showAddProductToCartDialog = (product) => {
    dialog({
      title: "Cart quantity for " + product.name,
      noBackdropDismiss: true,
      cancel: true,
      position: "top",
      prompt: {
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
        model: "",
        isValid: (val) => val != "",
      },
    }).onOk((val) => {
      cartStore.addProduct({ product: product, quantity: val });
    });
  };
  return {
    showAddProductToCartDialog
  }
}
