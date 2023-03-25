<template>
  <q-markup-table
    class="bg-transparent text-grey-10"
    separator="cell"
    flat
    bordered
    wrap-cells
  >
    <thead>
      <tr>
        <th class="text-left">#</th>
        <th class="text-left">Name</th>
        <th class="text-right">Price</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(product, key) in products"
        :key="key"
        :class="{
          'bg-secondary': product.group == 2,
          'bg-info': product.group == 3,
          'bg-accent': product.group == 4,
          'text-white': product.group != 1,
        }"
      >
        <td class="text-left">{{ key + 1 }}</td>
        <td class="text-left">
          <span @click="showAddToppingDialog(product, key)">
            {{ product.name }}
          </span>
          <span v-if="product?.toppings?.length && toppings.length">
            ({{
              getToppings(product.toppings)
                .map((e) => e?.name)
                .join(", ")
            }})
          </span>
        </td>
        <td class="text-right">
          <span
            :class="{ 'text-accent': product.discount }"
            @click="showDiscountDialog(product, key)"
          >
            {{
              (
                product.price - (product.discount ?? 0) || "FOC"
              ).toLocaleString()
            }}
            <template v-if="product.toppings && product.toppings.length > 0">
              +
              {{
                getToppings(product.toppings)
                  .reduce((carry, el) => carry + el.price, 0)
                  .toLocaleString()
              }}
            </template>
          </span>
        </td>
        <td class="text-right">
          <span @click="editQuanity(product, key)">{{ product.quantity }}</span>
        </td>
        <td class="text-right">
          <span @click="toggleFOC(product, key)">
            {{
              product.foc
                ? "FOC"
                : (
                    (product.price -
                      (product.discount ?? 0) +
                      getToppings(product.toppings).reduce(
                        (carry, el) => carry + el.price,
                        0
                      )) *
                      product.quantity || "FOC"
                  ).toLocaleString()
            }}
          </span>
        </td>
      </tr>

      <tr>
        <td colspan="3" class="text-right">Total</td>
        <td class="text-right">
          {{ products.reduce((carry, product) => carry + product.quantity, 0) }}
        </td>
        <td class="text-right">
          {{
            products
              .filter((e) => !e.foc)
              .reduce(
                (carry, product) =>
                  carry +
                  (product.price -
                    (product.discount ?? 0) +
                    getToppings(product.toppings).reduce(
                      (carry, el) => carry + el.price,
                      0
                    )) *
                    product.quantity,
                0
              )
              .toLocaleString()
          }}
        </td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td class="text-right">Amount</td>
        <td class="text-right">
          {{
            (
              products
                .filter((e) => !e.foc)
                .reduce(
                  (carry, product) =>
                    carry +
                    (product.price -
                      (product.discount ?? 0) +
                      getToppings(product.toppings).reduce(
                        (carry, el) => carry + el.price,
                        0
                      )) *
                      product.quantity,
                  0
                ) - discount || "FOC"
            ).toLocaleString()
          }}
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref } from "vue";

const { api } = useUtil();
const { dialog } = useQuasar();

const getToppings = (toppingIds) => {
  if (!toppingIds) return [];
  return toppings.value.filter(
    (e) => toppingIds?.findIndex((el) => el == e.id) != -1
  );
};
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["productUpdated"]);

const toggleFOC = (product, index) => {
  dialog({
    title: product.foc ? "Mark as not FOC" : "Mark as FOC",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    product.foc = !product.foc;
    emit("productUpdated", { product, index });
  });
};

const showDiscountDialog = (product, index) => {
  dialog({
    title: "Discount for " + product.name,
    message: "Price is " + product.price,
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      isValid: (val) => val >= 0 && val <= product.price,
    },
  }).onOk((val) => {
    product.discount = Number(val);
    emit("productUpdated", { product, index });
  });
};

const toppings = ref([]);

if (props.editable)
  api({ method: "GET", url: "toppings" }).then(({ data }) => {
    toppings.value = data.toppings;
  });

const showAddToppingDialog = (product, index) => {
  if (props.editable)
    dialog({
      title: "Add topping to " + product.name,
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
      options: {
        type: "checkbox",
        model: product.toppings ?? [],
        items: toppings.value.map((e) => ({ label: e.name, value: e.id })),
      },
    }).onOk((toppings) => {
      emit("productUpdated", {
        product: {
          ...product,
          toppings: toppings.length ? toppings : undefined,
        },
        index: index,
      });
    });
};

const editQuanity = (product, index) => {
  dialog({
    title: "Cart quantity",
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      model: "",
      isValid: (val) => val >= 0 && val != "",
    },
  }).onOk((qty) => {
    if (qty == 0)
      dialog({
        title: "Confirm",
        message: `Remove ${product.name} from cart?`,
        noBackdropDismiss: true,
        cancel: true,
      })
        .onOk(() => {
          emit("productUpdated", {
            product: { ...product, quantity: Number(qty) },
            index: index,
          });
        })
        .onCancel(() => {
          editQuanity(product, index);
        });
    else
      emit("productUpdated", {
        product: { ...product, quantity: Number(qty) },
        index: index,
      });
  });
};
</script>
