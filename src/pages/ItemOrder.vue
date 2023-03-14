<template>
  <q-page padding>
    <div class="text-h6 text-center">Item Order</div>
    <div class="text-right">
      <q-btn
        label="Show Order"
        no-caps
        flat
        @click="showOrder"
        :disabled="orderItems.length <= 0"
      />
    </div>
    <q-list separator padding>
      <q-item
        v-for="item in items"
        :key="item.id"
        clickable
        @click="showChooseQty(item)"
      >
        <q-item-section>
          <q-item-label>
            {{ item.name }} ({{ item.stock }} remaining)
          </q-item-label>
        </q-item-section>
        <q-item-section side v-if="item.quantity">
          <q-item-label overline>Quantity: {{ item.quantity }} </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref, computed } from "vue";

const items = ref([]);
const { api } = useUtil();
const { dialog } = useQuasar();

api({
  method: "GET",
  url: "items",
  params: {
    per_page: 100,
  },
}).then(({ data }) => {
  items.value = data.data.data.map((e) => {
    e.quantity = 0;
    return e;
  });
});

const showChooseQty = (item) => {
  dialog({
    title: "Quantity",
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      model: item.quantity || "1",
      isValid: (val) => val != "" && val >= 0,
    },
  }).onOk((val) => {
    const index = items.value.findIndex((e) => e.id == item.id);
    items.value[index].quantity = Number(val);
  });
};

const orderItems = computed(() => items.value.filter((e) => e.quantity > 0));

const showOrder = () => {
  dialog({
    title: "Item Order",
    message: "Please put these items into order",
    options: {
      type: "checkbox",
      model: orderItems.value.map((e) => e.id),
      // inline: true
      items: orderItems.value.map((e) => ({
        label: `${e.name}, (${e.quantity})`,
        value: e.id,
      })),
    },
  });
};
</script>
