<template>
  <q-form @submit.prevent="submit" class="q-pa-sm">
    <div class="text-center text-subtitle2">Record expense</div>
    <q-input label="Name" required autofocus v-model.trim="form.name" />
    <q-input
      label="Amount"
      required
      v-model.number="form.amount"
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
    />
    <q-input
      label="Quantity"
      required
      v-model="form.quantity"
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
    />
    <q-input label="Note" v-model="form.note" />
    <div class="text-right">
      <q-btn icon="save" flat type="submit" />
    </div>
    <div class="row justify-around q-mt-sm">
      <q-btn
        v-for="expense in expenses"
        :key="expense.id"
        :label="expense.name"
        no-caps
        @click="fillForm(expense)"
      />
    </div>
  </q-form>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref } from "vue";

const emit = defineEmits(["submitted"]);

const form = ref({
  name: "",
  amount: "",
  quantity: 1,
  note: "",
});
const fillForm = (expense) => {
  form.value.name = expense.name;
  form.value.amount = expense.latest_purchase.price;
};
const { api } = useUtil();
const expenses = ref([]);
const submit = () => {
  api({
    method: "POST",
    url: "expenses/purchase",
    data: {
      name: form.value.name,
      amount: form.value.amount,
      quantity: form.value.quantity,
      note: form.value.note,
    },
  }).then(({ data }) => {
    emit("submitted", data.expense);
  });
};

api({
  method: "GET",
  url: "expenses",
}).then(({ data }) => {
  expenses.value = data.data.data;
});
</script>
