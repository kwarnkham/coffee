<template>
  <q-page>
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

const userStore = useUserStore();

const productStore = useProductStore();
const { showAddProductToCartDialog } = useApp();
</script>
