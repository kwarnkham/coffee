<template>
  <q-list>
    <q-item v-for="item in items" :key="item.id">
      <q-item-section>
        <div>{{ item.name }}</div>
        <q-item-label overline>Stock : {{ item.stock }}</q-item-label>
      </q-item-section>
      <q-item-section top side>
        <q-icon name="edit" @click="showEditItemFormDialog(item)" />
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
const emit = defineEmits(["itemUpdated"]);
const { dialog } = useQuasar();
const { api } = useUtil();
const showEditItemFormDialog = (item) => {
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
</script>
