<template>
  <q-page padding>
    <template v-if="products.length">
      <div>
        <q-input type="text" label="Note" v-model.lazy.trim="note" />
      </div>
      <OrderProducts
        class="q-mt-sm"
        :products="products"
        editable
        :discount="cartStore.getCart.discount"
      />
      <div class="text-right q-mt-sm">
        <q-btn icon="save" @click="saveOrder" />
      </div>
    </template>
    <div v-else class="text-center text-h6">No products in cart</div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import OrderProducts from "src/components/OrderProducts.vue";
import useUtil from "src/composables/util";
import { useCartStore } from "src/stores/cart-store";
import { useUserStore } from "src/stores/user-store";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const isCart = computed(() => route.name == "cart");
const cartStore = useCartStore();
const products = ref(isCart.value ? cartStore.getCart.products : []);
const { api } = useUtil();
const userStore = useUserStore();
const router = useRouter();
const note = ref(isCart.value ? cartStore.getCart.note : "");

const saveOrder = () => {
  if (products.value.length == 0) return;
  api(
    {
      method: isCart.value ? "POST" : "PUT",
      url: isCart.value ? "orders" : `orders/${route.params.order}`,
      data: {
        user_id: userStore.getUser.id,
        products: products.value,
        discount: cartStore.getCart.discount,
        note: note.value,
      },
    },
    true
  ).then(({ data }) => {
    if (isCart.value) {
      cartStore.clear();
      router.replace({
        name: "order-details",
        params: {
          order: data.order.id,
        },
      });
    } else {
      assignData(data);
    }
  });
};

const assignData = (data) => {
  data.order.products = data.order.products.map((product) => {
    product.price = product.pivot.price;
    product.quantity = product.pivot.quantity;
    product.name = product.pivot.name;
    product.toppings = product.pivot.toppings.map((el) => el.id);
    return product;
  });
  products.value = data.order.products;
  note.value = data.order.note;
};
if (!isCart.value)
  api({
    method: "GET",
    url: `orders/${route.params.order}`,
  }).then(({ data }) => {
    assignData(data);
  });
</script>
