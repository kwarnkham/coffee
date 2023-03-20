<template>
  <q-page>
    <div class="text-center q-py-xs">
      <q-btn icon="add" @click="showAddProductDialog" />
    </div>
    <q-list separator padding>
      <q-item v-for="product in productStore.getProducts" :key="product.id">
        <q-item-section no-wrap>
          <div>{{ product.name }}</div>
          <q-item-label caption>{{ product.price }} MMK</q-item-label>
        </q-item-section>
        <q-item-section top side>
          <q-btn
            flat
            v-if="userStore.getUser?.roles?.map((e) => e.name).includes('sale')"
            icon="add_shopping_cart"
            @click="showAddProductToCartDialog(product)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useUserStore } from "src/stores/user-store";
import { useProductStore } from "src/stores/products-store";
import useApp from "src/composables/app";
import { useQuasar } from "quasar";
import ProductFormDialog from "src/components/ProductFormDialog.vue";

const userStore = useUserStore();
const { dialog } = useQuasar();

const productStore = useProductStore();
const { showAddProductToCartDialog } = useApp();
const showAddProductDialog = () => {
  dialog({
    component: ProductFormDialog,
  }).onOk((product) => {
    productStore.setProducts([...productStore.getProducts, product]);
  });
};
</script>
