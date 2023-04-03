<template>
  <q-page padding>
    <div class="text-center text-h6">Number: 09-{{ user.name }}</div>
    <div>
      Effective cups for next FOC : {{ user.cup - 10 * user.redemption }}
    </div>
    <div>Total cups: {{ user.cup }}</div>
    <div>Total FOC: {{ user.redemption }}</div>
  </q-page>
</template>

<script setup>
import { useUserStore } from "src/stores/user-store";
import { computed } from "vue";

const userStore = useUserStore();
const user = computed(() => userStore.getUser);
</script>
