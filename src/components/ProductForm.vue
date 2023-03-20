<template>
  <q-form @submit.prevent="submit" class="q-pa-sm">
    <div class="text-center text-h6">New Product</div>
    <q-input v-model="form.name" required autofocus label="Name" />
    <q-input
      v-model.number="form.price"
      required
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      label="Price"
    />
    <q-input v-model="form.descrption" type="textarea" label="Description" />
    <div class="text-right">
      <q-btn type="submit" icon="save" />
    </div>
  </q-form>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref } from "vue";

const { api } = useUtil();
const emit = defineEmits(["submitted"]);
const submit = () => {
  api(
    {
      method: "POST",
      url: "products",
      data: {
        name: form.value.name,
        price: form.value.price,
        description: form.value.description,
      },
    },
    true
  ).then(({ data }) => {
    emit("submitted", data.product);
  });
};
const form = ref({
  name: "",
  price: "",
  description: "",
});
</script>
