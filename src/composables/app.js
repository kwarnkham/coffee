import { useQuasar } from "quasar";
import { useCartStore } from "src/stores/cart-store";
import { inject } from "vue";
import { useRoute } from "vue-router";

export default function useApp () {
  const cartStore = useCartStore()
  const { dialog } = useQuasar();
  const bus = inject('bus')
  const route = useRoute()
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
      if (route.name == 'order-details') bus.emit("cartProductAdded", { product: product, quantity: val });
      else cartStore.addProduct({ product: product, quantity: val })
    });
  };

  const parseOrderStatus = (code) => {
    switch (code) {
      case 1:
        return "Pending"
      case 2:
        return "Paid"
      case 3:
        return "Completed"
      case 4:
        return "Canceled"
      default:
        return "Unknown, " + code
    }
  }
  return {
    showAddProductToCartDialog,
    parseOrderStatus
  }
}
