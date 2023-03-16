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
        <q-item-section>
          <span> #{{ order.id }} {{ order.note }} </span>
          <q-item-label>{{ parseOrderStatus(order.status) }}</q-item-label>
        </q-item-section>
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
import useApp from "src/composables/app";
import usePagination from "src/composables/pagination";

const { pagination } = usePagination("orders");
const { parseOrderStatus } = useApp();
</script>
