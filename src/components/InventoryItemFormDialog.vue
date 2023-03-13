<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    position="top"
  >
    <q-card class="q-dialog-plugin">
      <div class="text-right q-mt-sm">
        <q-btn icon="close" flat @click="onDialogCancel" />
      </div>
      <InventoryItemForm @item-purchased="onDialogOK" :item="item" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import InventoryItemForm from "./InventoryItemForm.vue";

const props = defineProps({
  item: {
    type: Object,
    required: false,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
