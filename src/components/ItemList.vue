<template>
  <q-list>
    <q-item v-for="item in items" :key="item.id">
      <q-item-section>
        <div>{{ item.name }}</div>
        <q-item-label overline>Stock : {{ item.stock }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>
