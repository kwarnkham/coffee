<template>
  <div>
    <q-input type="date" :model-value="from" @update:model-value="updateFrom">
      <template v-slot:prepend>
        <span
          class="text-caption text-weight-bold inline-block text-right"
          style="width: 3em"
        >
          From
        </span>
      </template>
    </q-input>
    <q-separator vertical />
    <q-input type="date" :model-value="to" @update:model-value="updateTo">
      <template v-slot:prepend>
        <span
          class="text-caption text-weight-bold inline-block text-right"
          style="width: 3em"
        >
          To
        </span>
      </template>
    </q-input>
    <div class="q-my-sm text-right">
      <q-btn
        icon="search"
        @click="
          $router
            .replace({
              name: $route.name,
              query: { ...$route.query, from, to, page: undefined },
            })
            .then(() => {
              fetch($route.query);
            })
        "
        flat
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  fetch: {
    requried: true,
    type: Function,
  },
  from: {
    requried: true,
    type: String,
  },
  to: {
    required: true,
    type: String,
  },
});

const emit = defineEmits(["fromSelected", "toSelected"]);

const updateFrom = (payload) => {
  emit("fromSelected", payload);
};

const updateTo = (payload) => {
  emit("toSelected", payload);
};
</script>
