<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
        <template v-for="link in links" :key="link.route">
          <q-item
            clickable
            v-if="
              (link.requiresAuth && userStore.getUser) ||
              (!userStore.getUser && !link.requiresAuth)
            "
            :to="{
              name: link.route,
            }"
          >
            <q-item-section>
              <q-item-label>{{ link.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <q-item clickable v-if="userStore.getUser" @click="logout">
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api as axios } from "src/boot/axios";

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const userStore = useUserStore();
const { api } = useUtil();
const { dialog, localStorage } = useQuasar();
const router = useRouter();
const links = [
  {
    name: "Inventory Item",
    route: "inventory-item",
    requiresAuth: true,
  },
  {
    name: "Login",
    route: "login",
    requiresAuth: false,
  },
];

const logout = () => {
  dialog({
    title: "Confirm",
    message: "Do you want to logout?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: "logout",
    }).finally(() => {
      localStorage.remove("token");
      userStore.setUser(null);
      axios.defaults.headers.common["Authorization"] = undefined;
      router.replace({
        name: "index",
      });
    });
  });
};
</script>
