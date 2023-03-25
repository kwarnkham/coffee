<template>
  <router-view />
</template>

<script setup>
import { useProductStore } from "src/stores/products-store";
import useUtil from "src/composables/util";
import { useUserStore } from "./stores/user-store";
import { useRoleStore } from "./stores/role-store";
import { watch, computed } from "vue";

const productStore = useProductStore();
const { api } = useUtil();
const userStore = useUserStore();
const roleStore = useRoleStore();

const user = computed(() => userStore.getUser);

api({
  method: "GET",
  url: "roles",
}).then(({ data }) => {
  roleStore.setRoles(data.roles);
});
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
