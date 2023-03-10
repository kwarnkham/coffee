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
      <tr v-for="(product, key) in products" :key="key">
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
          <span :class="{ 'text-accent': product.discount }">
            {{
              (
                product.price - (product.discount ?? 0) || "FOC"
              ).toLocaleString()
            }}
            <template v-if="product.toppings">
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
          <span>
            {{
              (
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
      <!-- <tr>
        <td colspan="3"></td>
        <td class="text-right" @click="applyDiscount">Discount</td>
        <td class="text-right">
          <span>
            {{ discount.toLocaleString() }}
          </span>
        </td>
      </tr> -->
      <tr>
        <td colspan="3"></td>
        <td class="text-right">Amount</td>
        <td class="text-right">
          {{
            (
              products.reduce(
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
import { useCartStore } from "src/stores/cart-store";
import { ref } from "vue";

const { api } = useUtil();
const { dialog } = useQuasar();
const cartStore = useCartStore();

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
      cartStore.updateProduct(
        {
          ...product,
          toppings: toppings.length ? toppings : undefined,
        },
        index
      );
    });
};

const editQuanity = (product, index) => {
  dialog({
    title: "Cart quantity",
    message: `${
      product.stock +
      product.quantity -
      props.products
        .filter((e) => e.id == product.id)
        .reduce((carry, e) => carry + e.quantity, 0)
    } left`,
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt: {
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      model: "",
      isValid: (val) =>
        val >= 0 &&
        val <=
          product.stock +
            product.quantity -
            props.products
              .filter((e) => e.id == product.id)
              .reduce((carry, e) => carry + e.quantity, 0) &&
        val != "",
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
          cartStore.updateProduct({ ...product, quantity: Number(qty) }, index);
        })
        .onCancel(() => {
          editQuanity(product, index);
        });
    else cartStore.updateProduct({ ...product, quantity: Number(qty) }, index);
  });
};

// const applyDiscount = () => {
//   dialog({
//     title: "Apply discount",
//     message: `Discount for the whole order`,
//     prompt: {
//       model: cartStore.getCart.discount || "",
//       type: "number",
//       inputmode: "numeric",
//       pattern: "[0-9]*",
//       isValid: (val) =>
//         val <=
//           props.products.reduce(
//             (carry, product) =>
//               carry +
//               (product.price - (product.discount ?? 0)) * product.quantity,
//             0
//           ) && val >= 0,
//     },
//     position: "top",
//     noBackdropDismiss: true,
//     cancel: true,
//   }).onOk((value) => {
//     cartStore.applyDiscount(value);
//   });
// };
</script>
