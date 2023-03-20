<template>
  <q-form @submit.prevent="submit" class="q-pa-sm">
    <div class="text-center text-h6">
      {{ product ? "Update" : "New" }} Product
    </div>
    <q-input v-model="form.name" required autofocus label="Name" />
    <q-input
      v-model.number="form.price"
      required
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      label="Price"
    />
    <q-input v-model="form.description" type="textarea" label="Description" />
    <div class="q-gutter-sm">
      <q-radio
        v-model="form.status"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        :val="1"
        label="Enabled"
      />
      <q-radio
        v-model="form.status"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        :val="2"
        label="Disabled"
      />
    </div>
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
const props = defineProps({
  product: {
    type: Object,
    required: false,
  },
});
const submit = () => {
  const options = {
    method: "POST",
    url: "products",
    data: {
      name: form.value.name,
      price: form.value.price,
      description: form.value.description,
      status: form.value.status,
    },
  };

  if (props.product) {
    options.url = `products/${props.product.id}`;
    options.method = "PUT";
  }

  api(options, true).then(({ data }) => {
    emit("submitted", data.product);
  });
};
const form = ref({
  name: props.product?.name ?? "",
  price: props.product?.price ?? "",
  description: props.product?.description ?? "",
  status: props.product?.status ?? 1,
});
</script>
