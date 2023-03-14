<template>
  <q-page padding>
    <div class="text-center q-gutter-x-xs">
      <q-btn icon="add" @click="showExpenseFormDialog" />
      <q-btn
        label="Expense Type"
        no-caps
        @click="
          $router.push({
            name: 'expense-type',
          })
        "
      />
    </div>
    <q-separator spaced />
    <div class="text-center text-h6">Purchases</div>
    <q-list v-if="pagination" separator padding>
      <q-item v-for="purchase in pagination.data" :key="purchase.id">
        <q-item-section>
          <span>{{ purchase.purchasable.name }} </span>
          <span>Price : {{ purchase.price }} </span>
          <q-item-label>Qty: {{ purchase.quantity }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label overline>{{
            purchase.quantity * purchase.price
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <AppPagination
      v-model="current"
      :max="max"
      :pagination="pagination"
      v-if="pagination"
    />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import AppPagination from "src/components/AppPagination.vue";
import usePagination from "src/composables/pagination";
import ExpenseFormDialog from "src/components/ExpenseFormDialog.vue";

const { pagination, current, max } = usePagination("purchases");
const { dialog } = useQuasar();

const showExpenseFormDialog = () => {
  dialog({
    component: ExpenseFormDialog,
  }).onOk((expense) => {
    const purchase = JSON.parse(JSON.stringify(expense.latest_purchase));
    purchase.purchasable = expense;
    pagination.value.data.unshift(purchase);
  });
};
</script>
