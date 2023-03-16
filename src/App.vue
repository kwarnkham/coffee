<template>
  <router-view />
</template>

<script setup>
import { useProductStore } from "src/stores/products-store";
import useUtil from "src/composables/util";

const productStore = useProductStore();
const { api } = useUtil();
api({
  method: "GET",
  url: "products",
  params: {
    per_page: 100,
  },
}).then(({ data }) => {
  productStore.setProducts(data.data.data);
});
</script>
