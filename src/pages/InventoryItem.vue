<template>
  <q-page padding>
    <div class="text-h6 text-center">Inventory Items</div>
    <q-separator spaced />
    <div class="text-center">
      <q-btn icon="add" round flat @click="showInventoryItemFormDialog" />
    </div>
    <q-separator spaced />
    <q-input v-model="search" label="Search" />
    <q-separator spaced />

    <ItemList v-if="pagination" :items="pagination.data" />
    <q-separator spaced />

    <AppPagination
      v-model="current"
      :max="max"
      :pagination="pagination"
      v-if="pagination"
    />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import InventoryItemFormDialog from "src/components/InventoryItemFormDialog.vue";
import ItemList from "src/components/ItemList.vue";
import usePagination from "src/composables/pagination";
import AppPagination from "src/components/AppPagination.vue";
import useSearchFilter from "src/composables/searchFilter";

const { dialog } = useQuasar();

const showInventoryItemFormDialog = () => {
  dialog({
    component: InventoryItemFormDialog,
  }).onOk((item) => {
    const index = pagination.value.data.findIndex((e) => e.id == item.id);
    if (index != -1) pagination.value.data[index] = item;
  });
};

const { pagination, current, max, fetch } = usePagination("items");
const { search } = useSearchFilter({ current, fetch });
</script>
