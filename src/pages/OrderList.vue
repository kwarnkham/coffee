<template>
  <q-page padding v-if="pagination">
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
    <div class="text-center" v-if="summery">{{ summery.toLocaleString() }}</div>
    <q-list bordered padding separator>
      <q-item
        clickable
        v-for="order in pagination.data"
        :key="order.id"
        @click="
          $router.push({
            name: 'order-details',
            params: {
              order: order.id,
            },
          })
        "
      >
        <q-item-section>
          <span> #{{ order.id }} {{ order.note }} </span>
          <q-item-label>{{ parseOrderStatus(order.status) }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <span>
            {{
              new Date(order.updated_at).toLocaleString("en-GB", {
                hour12: true,
              })
            }}
          </span>
          <span>
            {{
              order.products.reduce(
                (carry, product) =>
                  (product.pivot.foc
                    ? 0
                    : (product.pivot.price +
                        product.pivot.toppings.reduce(
                          (carry, topping) =>
                            topping.pivot.price * topping.pivot.quantity +
                            carry,
                          0
                        ) -
                        product.pivot.discount) *
                      product.pivot.quantity) + carry,
                0
              )
            }}
          </span>
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
import AppPagination from "src/components/AppPagination.vue";
import useApp from "src/composables/app";
import usePagination from "src/composables/pagination";
import DateRangeSearch from "src/components/DateRangeSearch.vue";
import useDateRangeFilter from "src/composables/dateRangeFilter";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const { from, to } = useDateRangeFilter();
const { pagination, current, max, fetch, summery } = usePagination("orders", {
  from: from.value,
  to: to.value,
  summery: userStore.getUser.roles.map((e) => e.name).includes("investor")
    ? 1
    : undefined,
});
const { parseOrderStatus } = useApp();
</script>
