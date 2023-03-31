<template>
  <q-page padding>
    <q-form @submit.prevent="submit" ref="passwordForm">
      <div class="text-h6 text-center">Change Password</div>
      <q-input
        v-model="form.password"
        reqired
        autocomplete="current-password"
        label="Current Password"
        type="password"
      />
      <q-input
        v-model="form.newPassword"
        reqired
        label="New Password"
        type="password"
      />
      <q-input
        v-model="form.newPasswordConfirmation"
        reqired
        label="New Password Again"
        type="password"
        lazy-rules
        :rules="[
          (val) => val == form.newPassword || 'New passwords must be the same',
        ]"
      />
      <div class="text-right">
        <q-btn icon="save" type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref } from "vue";

const { notify } = useQuasar();
const passwordForm = ref(null);
const form = ref({
  password: "",
  newPassword: "",
  newPasswordConfirmation: "",
});
const { api } = useUtil();
const submit = () => {
  api(
    {
      method: "POST",
      url: "change-password",
      data: {
        password: form.value.password,
        new_password: form.value.newPassword,
        new_password_confirmation: form.value.newPasswordConfirmation,
      },
    },
    true
  ).then(() => {
    form.value.password = "";
    form.value.newPassword = "";
    form.value.newPasswordConfirmation = "";
    passwordForm.value.resetValidation();
    notify({
      message: "Success",
      type: "positive",
    });
  });
};
</script>
