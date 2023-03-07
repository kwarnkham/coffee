<template>
  <q-form @submit.prevent="submit" class="q-px-md q-pb-md">
    <div class="text-center text-subtitle1 text-weight-bold">Record Item</div>

    <q-input v-model="form.name" required label="Name" />
    <q-input
      v-model="form.price"
      required
      label="Price"
      type="numeric"
      inputmode="numeric"
      pattern="[0-9]*"
    />
    <q-input
      v-model="form.quantity"
      required
      label="Quantity"
      type="numeric"
      inputmode="numeric"
      pattern="[0-9]*"
    />
    <q-input v-model="form.note" type="textarea" label="Note" />

    <div class="text-right q-mt-md">
      <q-btn icon="save" flat type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
const { dialog } = useQuasar();
const emit = defineEmits(["itemPurchased"]);
const form = ref({
  name: "Coffee Bean",
  quantity: "10",
  price: "1000",
  note: "",
});

const { api } = useUtil();

const submit = () => {
  api(
    {
      method: "POST",
      url: "items/purchase",
      data: form.value,
    },
    true
  ).then(({ data }) => {
    emit("itemPurchased", data.item);
  });
};
</script>
