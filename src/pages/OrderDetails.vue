<template>
  <q-page padding>
    <div class="text-center text-h6" v-if="!isCart">
      Order is
      <span class="text-primary">{{ parseOrderStatus(order?.status) }}</span>
    </div>
    <div>
      <q-input
        type="text"
        label="Note"
        v-model.lazy="note"
        :disable="order?.status != 1"
      />
    </div>
    <div class="text-center q-my-xs" v-if="order?.status == 1 || isCart">
      <q-btn
        label="Add products to cart"
        no-caps
        flat
        @click="showSelectProductsDialog"
      />
    </div>
    <OrderProducts
      @product-updated="updateProduct"
      v-if="products.length"
      class="q-mt-sm"
      :products="products"
      editable
      :discount="cartStore.getCart.discount"
    />
    <div v-else class="text-center text-h6">No products in cart yet</div>
    <div class="text-right q-mt-sm q-gutter-x-sm" v-if="products.length">
      <q-btn
        icon="save"
        @click="saveOrder(1)"
        v-if="!isClean"
        color="primary"
      />
      <q-btn
        icon="paid"
        @click="saveOrder(2)"
        v-if="!isCart && isClean && order?.status == 1"
        color="positive"
      />
      <q-btn
        label="Clear"
        @click="clearCart"
        no-caps
        v-if="isCart || order?.status == 1"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import OrderProducts from "src/components/OrderProducts.vue";
import ProductButtons from "src/components/ProductButtons.vue";
import useUtil from "src/composables/util";
import useApp from "src/composables/app";
import { useCartStore } from "src/stores/cart-store";
import { useUserStore } from "src/stores/user-store";
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const { parseOrderStatus } = useApp();
const isCart = computed(() => route.name == "cart");
const cartStore = useCartStore();
const products = ref(isCart.value ? cartStore.getCart.products : []);
const bus = inject("bus");
const { api } = useUtil();
const userStore = useUserStore();
const router = useRouter();
const note = ref(isCart.value ? cartStore.getCart.note : "");
const { dialog } = useQuasar();
const order = ref(null);

const isClean = computed(
  () =>
    products.value.length == order.value?.products.length &&
    note.value == order.value.note &&
    products.value.every((e) => {
      const found = order.value.products.find((el) => el.id == e.id);

      return (
        found != undefined &&
        found.pivot.quantity == e.quantity &&
        found.pivot.price == e.price &&
        (found.pivot.toppings == undefined
          ? e.toppings == undefined || e.toppings?.length == 0
          : found.pivot.toppings.length == e.toppings?.length)
      );
    })
);
const showSelectProductsDialog = () => {
  dialog({
    component: ProductButtons,
  });
};
const saveOrder = (status = 1) => {
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
        status,
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
      assignData(data.order);
    }
  });
};

const updateProduct = ({ product, index }) => {
  if (isCart.value) cartStore.updateProduct(product, index);
  else {
    product = JSON.parse(JSON.stringify(product));
    if (product.quantity <= 0) products.value.splice(index, 1);
    else products.value[index] = product;
  }
};

const clearCart = () => {
  if (isCart.value) {
    products.value = [];
    note.value = "";
    cartStore.clear();
  } else {
    assignData(order.value);
  }
};

const assignData = (data) => {
  products.value = data.products.map((product) => {
    product = JSON.parse(JSON.stringify(product));
    product.price = product.pivot.price;
    product.quantity = product.pivot.quantity;
    product.name = product.pivot.name;
    product.toppings = product.pivot.toppings.map((el) => el.id);
    return product;
  });

  note.value = data.note;
  order.value = data;
};

const addNewProduct = ({ product, quantity }) => {
  product = JSON.parse(JSON.stringify(product));
  product.quantity = Number(quantity);
  const existed = products.value.findIndex(
    (e) => e.id == product.id && (!e.toppings || e.toppings.length == 0)
  );
  if (existed == -1) products.value.push(product);
  else products.value[existed].quantity += product.quantity;
};
if (!isCart.value)
  api({
    method: "GET",
    url: `orders/${route.params.order}`,
  }).then(({ data }) => {
    assignData(data.order);
  });

if (!isCart.value) {
  bus.on("cartProductAdded", addNewProduct);
}
</script>
