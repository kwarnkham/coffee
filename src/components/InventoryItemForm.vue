<template>
  <q-form @submit.prevent="submit" class="q-px-md q-pb-md">
    <div class="text-center text-subtitle1 text-weight-bold">Record Item</div>

    <q-input
      v-model="form.name"
      required
      label="Name"
      :autofocus="!item"
      :disable="item != undefined"
    />
    <q-input
      v-model.number="form.price"
      required
      label="Price"
      type="numeric"
      inputmode="numeric"
      pattern="[0-9]*"
    />
    <q-input
      v-model.number="form.quantity"
      :autofocus="!!item"
      required
      label="Quantity"
      type="numeric"
      inputmode="numeric"
      pattern="[0-9]*"
    />
    <q-input v-model.trim="form.note" type="textarea" label="Note" />

    <div class="text-right q-mt-md">
      <q-btn icon="save" flat type="submit" />
    </div>
    <div class="row justify-around q-py-sm">
      <q-btn
        :label="item.name"
        no-caps
        v-for="item in items"
        :key="item.id"
        @click="chooseItem(item)"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref, watch } from "vue";
import useUtil from "src/composables/util";
import { debounce } from "quasar";

const emit = defineEmits(["itemPurchased"]);
const props = defineProps({
  item: {
    type: Object,
    required: false,
  },
});
const form = ref({
  name: props?.item?.name ?? "",
  quantity: "",
  price: props?.item?.latest_purchase?.price,
  note: "",
});

const { api } = useUtil();
const search = ref("");
const items = ref([]);
const chooseItem = (item) => {
  form.value.name = item.name;
  form.value.price = item.latest_purchase?.price || "";
};
watch(
  search,
  debounce(() => {
    if (search.value)
      api({
        method: "GET",
        url: "items/search",
        params: {
          limit: 5,
          search: search.value,
        },
      }).then(({ data }) => {
        items.value = data.items;
      });
  }, 400)
);
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

watch(
  form,
  () => {
    if (!props.item) search.value = form.value.name;
  },
  {
    deep: true,
  }
);
</script>
