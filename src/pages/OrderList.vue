<template>
  <q-page padding v-if="pagination">
    <q-list bordered padding separator>
      <q-item
        clickable
        v-for="order in pagination.data"
        :key="order.id"
        @click="
          $router.push({
            name: 'order-details',
            params: {
              order: order.id,
            },
          })
        "
      >
        <q-item-section> #{{ order.id }} {{ order.note }} </q-item-section>
        <q-item-section side top>
          {{
            new Date(order.updated_at).toLocaleString("en-GB", { hour12: true })
          }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import usePagination from "src/composables/pagination";

const { pagination } = usePagination("orders");
</script>
