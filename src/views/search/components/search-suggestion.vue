<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(suggestion, index) in suggestions"
      :key="index"
      @click="$emit('search', suggestion)"
    >
      <div slot="title" v-html="highlight(suggestion)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash";

export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestions: [],
    };
  },
  computed: {},
  watch: {
    searchText: {
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText);
        this.suggestions = data.data.options;
      }, 300),
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    highlight(suggestion) {
      return suggestion.replace(
        new RegExp(this.searchText, "gi"),
        `<span style="color:red">${this.searchText}</span>`
      );
    },
  },
};
</script>

<style lang="less" scoped>
</style>