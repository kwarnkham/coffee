<template>
  <q-page padding>
    <template v-if="products.length">
      <div class="q-py-xs">
        <q-input label="Note" type="text" v-model="note" />
      </div>
      <OrderProducts
        :products="products"
        editable
        :discount="cartStore.getCart.discount"
      />
      <div class="text-right q-mt-sm">
        <q-btn icon="save" @click="createOrder" />
      </div>
    </template>
    <div v-else class="text-center text-h6">No products in cart</div>
  </q-page>
</template>

<script setup>
import OrderProducts from "src/components/OrderProducts.vue";
import useUtil from "src/composables/util";
import { useCartStore } from "src/stores/cart-store";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const products = ref(cartStore.getCart.products);
const { api } = useUtil();
const userStore = useUserStore();
const router = useRouter();
const note = ref("");
const createOrder = () => {
  if (products.value.length == 0) return;
  api(
    {
      method: "POST",
      url: "orders",
      data: {
        user_id: userStore.getUser.id,
        products: products.value,
        discount: cartStore.getCart.discount,
        note: note.value,
      },
    },
    true
  ).then(({ data }) => {
    cartStore.clear();
    router.replace({
      name: "order-details",
      params: {
        order: data.order.id,
      },
    });
  });
};
</script>
