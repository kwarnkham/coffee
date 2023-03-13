<template>
  <q-list bordered separator>
    <q-item v-for="item in items" :key="item.id">
      <q-item-section>
        <div>{{ item.name }}</div>
        <q-item-label overline>Stock : {{ item.stock }}</q-item-label>
      </q-item-section>
      <q-item-section top side class="q-gutter-y-sm">
        <q-btn icon="edit" @click="showEditNameDialog(item)" />
        <q-btn icon="info" @click="showReduceStockDialog(item, 'Fix stock')" />
      </q-item-section>
      <q-item-section top side class="q-gutter-y-sm">
        <q-btn icon="eject" @click="showReduceStockDialog(item)" />
        <q-btn icon="add" @click="$emit('addStock', item)" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["itemUpdated", "addStock"]);
const { dialog } = useQuasar();
const { api } = useUtil();
const showEditNameDialog = (item) => {
  dialog({
    noBackdropDismiss: true,
    position: "top",
    cancel: true,
    title: `Edit name of item ${item.name}`,
    prompt: {
      model: item.name,
      isValid: (val) => val != "",
    },
  }).onOk((val) => {
    api({
      method: "PUT",
      url: "items/" + item.id,
      data: {
        name: val,
      },
    }).then(({ data }) => {
      emit("itemUpdated", data.item);
    });
  });
};

const showReduceStockDialog = (item, note) => {
  dialog({
    noBackdropDismiss: true,
    position: "top",
    cancel: true,
    title: `Reduce stock of item ${item.name}. ${note ?? ""}`,
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      model: "",
      isValid: (val) => val > 0 && val <= item.stock,
      hint: item.stock + " Remaining",
    },
  }).onOk((val) => {
    api({
      method: "POST",
      url: `items/${item.id}/reduce-stock`,
      data: {
        quantity: val,
        note,
      },
    }).then(({ data }) => {
      emit("itemUpdated", data.item);
    });
  });
};
</script>
