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

    <div class="text-center text-h6">
      Purchases {{ summery ? summery.toLocaleString() : "" }}
    </div>
    <DateRangeSearch
      :fetch="fetch"
      :from="from"
      :to="to"
      @from-selected="
        (payload) => {
          from = payload;
        }
      "
      @to-selected="
        (payload) => {
          to = payload;
        }
      "
    />
    <q-list v-if="pagination" separator padding>
      <q-item v-for="purchase in pagination.data" :key="purchase.id">
        <q-item-section>
          <span>{{ purchase.purchasable.name }} </span>
          <span>Price : {{ purchase.price }} </span>
          <q-item-label>Qty: {{ purchase.quantity }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label overline>
            {{ purchase.quantity * purchase.price }}
          </q-item-label>
          <q-item-label>
            {{
              new Date(purchase.created_at).toLocaleString("en-GB", {
                hour12: true,
              })
            }}
          </q-item-label>
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
import useDateRangeFilter from "src/composables/dateRangeFilter";
import DateRangeSearch from "src/components/DateRangeSearch.vue";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const { from, to } = useDateRangeFilter();
const { pagination, current, max, fetch, summery } = usePagination(
  "purchases",
  {
    from: from.value,
    to: to.value,
    summery: userStore.getUser.roles.map((e) => e.name).includes("investor")
      ? 1
      : undefined,
  }
);
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
