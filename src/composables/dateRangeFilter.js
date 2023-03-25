import { ref } from "vue";
import { date } from "quasar";
import { useRoute } from "vue-router";
const { formatDate } = date;

export default function useDateRangeFilter () {
  const route = useRoute()
  const date = new Date();
  const from = ref(route.query.from ?? formatDate(new Date(date.getFullYear(), date.getMonth(), 1), "YYYY-MM-DD"));
  const to = ref(route.query.to ?? formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0), "YYYY-MM-DD"));

  return {
    from, to
  }
}
