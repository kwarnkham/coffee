<template>
  <q-page padding>
    <q-form @submit.prevent="submit">
      <div class="text-center text-subtitle1 text-weight-bold">Login</div>
      <q-input
        autofocus
        v-model.trim="form.name"
        required
        label="Name"
        autocomplete="username"
      />
      <q-input
        v-model.trim="form.password"
        required
        label="Password"
        :type="showPasword ? 'text' : 'password'"
        autocomplete="current-password"
      />
      <q-checkbox label="Show Password" v-model="showPasword" />
      <div class="text-right">
        <q-btn icon="login" flat type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";
import { api as axios } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const showPasword = ref(false);
const { localStorage } = useQuasar();
const { api } = useUtil();
const userStore = useUserStore();
const router = useRouter();
const form = ref({
  name: "",
  password: "",
});

const submit = () => {
  api(
    {
      url: "login",
      method: "POST",
      data: {
        name: form.value.name,
        password: form.value.password,
      },
    },
    true
  ).then(({ data }) => {
    localStorage.set("token", data.token);
    userStore.setUser(data.user);
    axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
    router.replace({
      name: "index",
    });
  });
};
</script>
