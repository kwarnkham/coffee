<template>
  <q-page padding>
    <div class="text-h5 text-center">Expense List</div>
    <q-list v-if="pagination" separator padding>
      <q-item
        v-for="expense in pagination.data"
        :key="expense.id"
        clickable
        @click="showEditExpenseName(expense)"
      >
        <q-item-section>
          {{ expense.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";

const { pagination } = usePagination("expenses");
const { dialog } = useQuasar();
const { api } = useUtil();
const showEditExpenseName = (expense) => {
  dialog({
    title: `Edit ${expense.name}`,
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt: {
      type: "text",
      model: expense.name,
      isValid: (val) => val != "",
    },
  }).onOk((val) => {
    api({
      method: "PUT",
      url: `expenses/${expense.id}`,
      data: {
        name: val,
      },
    }).then(({ data }) => {
      const index = pagination.value.data.findIndex(
        (e) => e.id == data.expense.id
      );
      pagination.value.data[index] = data.expense;
    });
  });
};
</script>
