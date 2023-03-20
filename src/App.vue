<template>
  <router-view />
</template>

<script setup>
import { useProductStore } from "src/stores/products-store";
import useUtil from "src/composables/util";
import { useUserStore } from "./stores/user-store";
import { watch, computed } from "vue";

const productStore = useProductStore();
const { api } = useUtil();
const userStore = useUserStore();

const user = computed(() => userStore.getUser);
watch(
  user,
  () => {
    api({
      method: "GET",
      url: "products",
      params: {
        per_page: 100,
        status: userStore.getUser?.roles.map((e) => e.name).includes("admin")
          ? undefined
          : 1,
      },
    }).then(({ data }) => {
      productStore.setProducts(data.data.data);
    });
  },
  {
    immediate: true,
  }
);
</script>
