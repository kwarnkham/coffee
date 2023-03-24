import { ref } from "vue";
import { date } from "quasar";
import { useRoute } from "vue-router";
const { formatDate } = date;

export default function useDateRangeFilter () {
  const route = useRoute()
  const from = ref(route.query.from ?? formatDate(new Date(), "YYYY-MM-DD"));
  const to = ref(route.query.to ?? formatDate(new Date(), "YYYY-MM-DD"));

  return {
    from, to
  }
}
