import { debounce } from "quasar";
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router";

export default function useSearchFilter ({ current, fetch, params }) {
  const route = useRoute();
  const router = useRouter()
  const search = ref(route.query.search ?? "");
  watch(
    search,
    debounce(() => {
      const options = {
        name: route.name,
        query: {},
      };
      if (search.value) options.query.search = search.value;
      if (params) options.query = { ...params, ...options.query }
      router.replace(options).then(() => {
        if (current.value == 1) fetch(options.query);
        else current.value = 1;
      });
    }, 800)
  );
  return {
    search,
  }
}
