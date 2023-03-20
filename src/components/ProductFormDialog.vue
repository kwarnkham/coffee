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
      <ProductForm @submitted="onDialogOK" :product="product" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import ProductForm from "src/components/ProductForm.vue";

defineEmits([...useDialogPluginComponent.emits]);
defineProps({
  product: {
    type: Object,
    required: false,
  },
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
