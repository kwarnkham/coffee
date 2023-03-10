<template>
  <q-page>
    <q-list v-if="pagination" separator padding>
      <q-item v-for="product in pagination.data" :key="product.id">
        <q-item-section no-wrap>
          <div>{{ product.name }}</div>
          <q-item-label caption>{{ product.price }} MMK</q-item-label>
          <div
            class="row q-mt-sm q-gutter-x-sm"
            v-if="userStore.getUser?.roles?.map((e) => e.name).includes('sale')"
          >
            <q-btn icon="add" @click="showAddProductStockDialog(product)" />
            <q-btn
              v-if="product.stock - getCartQuantity(product) > 0"
              icon="add_shopping_cart"
              @click="showAddProductToCartDialog(product)"
            />
          </div>
        </q-item-section>
        <q-item-section
          class="text-right"
          v-if="product.stock - getCartQuantity(product)"
        >
          <div><q-icon name="check_circle" size="2em" color="positive" /></div>
          <q-item-label caption>
            {{ product.stock - getCartQuantity(product) }} Left</q-item-label
          >
          <!-- <div class="row justify-between">
            <q-btn icon="save" v-for="i in 3" :key="i" />
          </div> -->
        </q-item-section>
        <q-item-section class="text-right" v-else>
          <div><q-icon name="info" size="2em" color="warning" /></div>
          <q-item-label caption> ဖုန်းခေါ်ပြီးကြိုစုံစမ်းကြည့်ပါ</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { useCartStore } from "src/stores/cart-store";
import { useUserStore } from "src/stores/user-store";
const { dialog } = useQuasar();
const { api } = useUtil();
const userStore = useUserStore();
const cartStore = useCartStore();
const { pagination } = usePagination("products", { per_page: 100 });
const { getCartQuantity } = useApp();
const showAddProductStockDialog = (product) => {
  dialog({
    title: "Quantity",
    message: `How many cups of ${product.name}?`,
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      model: "",
      isValid: (val) => val > 0,
    },
  }).onOk((val) => {
    api({
      method: "POST",
      url: `products/${product.id}/stock`,
      data: {
        quantity: val,
      },
    }).then(({ data }) => {
      const index = pagination.value.data.findIndex(
        (e) => e.id == data.product.id
      );
      if (index != -1) pagination.value.data[index].stock = data.product.stock;
    });
  });
};

const showAddProductToCartDialog = (product) => {
  dialog({
    title: "Cart quantity for " + product.name,
    message: `${product.stock - getCartQuantity(product)} left`,
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      model: "",
      isValid: (val) =>
        val > 0 && val <= product.stock - getCartQuantity(product),
    },
  }).onOk((val) => {
    cartStore.addProduct({ product: product, quantity: val });
  });
};
</script>
