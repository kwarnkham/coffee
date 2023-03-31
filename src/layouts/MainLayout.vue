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
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          @click="$router.go(-1)"
          v-if="$route.name != 'index'"
        />

        <q-toolbar-title> သေးသေးတင် Coffee </q-toolbar-title>

        <div v-if="userStore.getUser">
          <q-btn
            icon="shopping_cart"
            round
            color="secondary"
            @click="
              $router.push({
                name: 'cart',
              })
            "
          >
            <q-badge
              color="red"
              rounded
              floating
              v-if="cartStore.getCart.products.length > 0"
            />
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          {{
            userStore.getUser?.roles?.map((e) => e.name).join(", ") ?? "Welcome"
          }}
          <span v-if="userStore.getUser">
            {{
              userStore.getUser?.roles.map((e) => e.name).includes("customer")
                ? "09-" + userStore.getUser.name
                : userStore.getUser.name
            }}
          </span>
        </q-item-label>
        <template v-for="link in links" :key="link.route">
          <q-item
            exact
            clickable
            v-if="
              (link.requiresAuth && userStore.getUser && !link.role) ||
              (link.requiresAuth &&
                userStore.getUser &&
                userStore.getUser.roles
                  .map((e) => e.name)
                  .includes(link.role)) ||
              (link.onlyGuest && !userStore.getUser) ||
              (!link.onlyGuest && !link.requiresAuth)
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
      <router-view :key="$route.name" />
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
import { useCartStore } from "src/stores/cart-store";

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const userStore = useUserStore();
const cartStore = useCartStore();
const { api } = useUtil();
const { dialog, localStorage } = useQuasar();
const router = useRouter();
const links = [
  {
    name: "Home",
    route: "index",
  },
  {
    name: "Inventory Item",
    route: "inventory-item",
    requiresAuth: true,
    role: "sale",
  },
  {
    name: "Orders",
    route: "order",
    requiresAuth: true,
    role: "sale",
  },
  {
    name: "Expenses",
    route: "expense",
    requiresAuth: true,
    role: "admin",
  },
  {
    name: "Users",
    route: "users",
    requiresAuth: true,
    role: "admin",
  },
  {
    name: "Customers",
    route: "customers",
    requiresAuth: true,
    role: "sale",
  },
  {
    name: "Change Password",
    route: "change-password",
    requiresAuth: true,
  },
  {
    name: "Login",
    route: "login",
    onlyGuest: true,
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
