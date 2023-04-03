<template>
  <q-page padding :style-fn="vhPage" class="column">
    <div class="text-center">
      <q-btn
        icon="person_add"
        flat
        color="primary"
        @click="showAddCustomerDialog"
      />
    </div>
    <div class="text-center">
      <q-input label="Search..." v-model="search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-list v-if="pagination" class="col overflow-auto">
      <q-item v-for="user in pagination.data" :key="user.id">
        <q-item-section>
          <q-item-label>09-{{ user.name }} </q-item-label>
          <q-item-label caption>
            <q-icon name="add" />{{ user.cup }}
          </q-item-label>
          <q-item-label caption>
            <q-icon name="coffee" />{{ user.redemption }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row q-gutter-x-xs">
            <q-btn icon="add" round @click="addCupCount(user)" />
            <q-btn
              icon="coffee"
              round
              @click="redeem(user)"
              :disabled="user.cup - user.redemption * 10 < 10"
            />
          </div>
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
import useSearchFilter from "src/composables/searchFilter";
import useUtil from "src/composables/util";

const { dialog } = useQuasar();
const { api, vhPage } = useUtil();
const { pagination, current, max, fetch } = usePagination("users", {
  role: "customer",
});

const { search } = useSearchFilter({
  current,
  fetch,
  params: {
    role: "customer",
  },
});

const showAddCustomerDialog = () => {
  dialog({
    title: "Add Customer",
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      model: "",
      prefix: "09",
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
    },
  }).onOk((val) => {
    api({
      method: "POST",
      url: "users/customer",
      data: {
        name: val,
      },
    }).then(({ data }) => {
      pagination.value.data.unshift(data.user);
    });
  });
};

const addCupCount = (user) => {
  dialog({
    title: "Quantity",
    message: `"09-${user.name}" cups quantity`,
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt: {
      model: "1",
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
    },
  }).onOk((val) => {
    dialog({
      titel: "Confirmation",
      message: `${val} is correct?`,
      cancel: true,
      noBackdropDismiss: true,
    })
      .onOk(() => {
        api({
          method: "POST",
          url: `users/${user.id}/cups`,
          data: {
            quantity: val,
          },
        }).then(({ data }) => {
          const index = pagination.value.data.findIndex((e) => e.id == user.id);
          pagination.value.data[index] = data.user;
        });
      })
      .onCancel(() => {
        addCupCount(user);
      });
  });
};

const redeem = (user) => {
  dialog({
    titel: `09-${user}`,
    message: "Redeem cup",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `users/${user.id}/redeem`,
    }).then(({ data }) => {
      const index = pagination.value.data.findIndex((e) => e.id == user.id);
      pagination.value.data[index] = data.user;
    });
  });
};
</script>
