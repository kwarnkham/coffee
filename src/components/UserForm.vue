<template>
  <q-form @submit.prevent="submit">
    <div class="text-center text-h6">New User</div>
    <q-input v-model="form.name" required label="Name" />
    <q-select
      label="Roles"
      v-model="form.roles"
      multiple
      :options="roleStore.getRoles"
      option-value="id"
      option-label="name"
    />
    <div class="text-right q-my-xs">
      <q-btn icon="save" type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { useRoleStore } from "src/stores/role-store";
import useUtil from "src/composables/util";

const emit = defineEmits(["submitted"]);
const form = ref({
  name: "",
  roles: null,
});

const { api } = useUtil();

const submit = () => {
  api({
    method: "POST",
    url: "users",
    data: {
      name: form.value.name,
      roles: form.value.roles.map((role) => role.id),
    },
  }).then(({ data }) => {
    emit("submitted", data.user);
    form.value.name = "";
    form.value.roles = null;
  });
};

const roleStore = useRoleStore();
</script>
