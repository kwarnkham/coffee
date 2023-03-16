<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    position="top"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section class="row justify-around">
        <q-btn
          v-for="product in productStore.getProducts"
          :key="product.id"
          :label="product.name"
          flat
          no-caps
          @click="showAddProductToCartDialog(product)"
        />
      </q-card-section>
      <div class="text-right q-mt-sm">
        <q-btn icon="close" flat @click="onDialogCancel" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import useApp from "src/composables/app";
import { useProductStore } from "src/stores/products-store";

defineEmits([...useDialogPluginComponent.emits]);
const productStore = useProductStore();
const { showAddProductToCartDialog } = useApp();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
