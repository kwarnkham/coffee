<template>
  <q-page padding :style-fn="vhPage" class="column">
    <div class="text-h6 text-center">Inventory Items</div>
    <q-separator spaced />
    <div class="text-center">
      <q-btn icon="add" round flat @click="showInventoryItemFormDialog()" />
    </div>
    <q-separator spaced />
    <q-input v-model.trim="search" label="Search">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-separator spaced />

    <ItemList
      v-if="pagination"
      :items="pagination.data"
      class="col overflow-auto"
      @item-updated="updateItemList"
      @add-stock="showInventoryItemFormDialog"
    />
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
import useUtil from "src/composables/util";

const { dialog } = useQuasar();
const { vhPage } = useUtil();
const showInventoryItemFormDialog = (item) => {
  dialog({
    component: InventoryItemFormDialog,
    componentProps: {
      item,
    },
  }).onOk((item) => {
    const index = pagination.value.data.findIndex((e) => e.id == item.id);
    if (index != -1) pagination.value.data[index] = item;
    else {
      pagination.value.data.unshift(item);
    }
  });
};

const updateItemList = (item) => {
  const index = pagination.value.data.findIndex((e) => e.id == item.id);
  if (index != -1) pagination.value.data[index] = item;
};
const { pagination, current, max, fetch } = usePagination("items");
const { search } = useSearchFilter({ current, fetch });
</script>
