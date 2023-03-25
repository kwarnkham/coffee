<template>
  <q-page padding>
    <UserForm @submitted="prependUserList" />
    <q-list v-if="pagination" separator padding bordered>
      <div class="text-center text-h6">Users</div>
      <q-item v-for="user in pagination.data" :key="user.id">
        <q-item-section>
          <span>{{ user.name }}</span>
          <div class="row q-gutter-x-sm">
            <q-badge v-for="role in user.roles" :key="role.id">
              {{ role.name }}
            </q-badge>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import UserForm from "src/components/UserForm.vue";
import usePagination from "src/composables/pagination";

const { pagination } = usePagination("users");

const prependUserList = (user) => {
  pagination.value.data.unshift(user);
};
</script>
