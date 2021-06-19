<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        background="#3296fa"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :search-text="searchText" />

    <!-- 联想建议 -->
    <SearchSuggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />

    <!-- 历史记录 -->
    <SearchHistory
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
  </div>
</template>

<script>
import SearchSuggestion from "./components/search-suggestion.vue";
import SearchHistory from "./components/search-history.vue";
import SearchResult from "./components/search-result.vue";
import { setItem, getItem } from "@/utils/storage";
import { getSearchHistories } from "@/api/search";
import { mapState } from "vuex";

export default {
  name: "SearchIndex",
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult,
  },
  data() {
    return {
      searchText: "",
      //控制搜索结果的显示状态
      isResultShow: false,
      searchHistories: [],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    searchHistories() {
      setItem("search-histories", this.searchHistories);
    },
  },
  created() {
    this.loadSearchHistories();
  },
  mounted() {},
  methods: {
    onSearch(searchText) {
      this.searchText = searchText;
      const index = this.searchHistories.indexOf(searchText);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      this.searchHistories.unshift(searchText);
      // setItem("search-histories", this.searchHistories);
      this.isResultShow = true;
    },

    async loadSearchHistories() {
      let searchHistories = getItem("search-histories") || [];
      if (this.user) {
        const { data } = await getSearchHistories();
        searchHistories = [
          ...new Set([...searchHistories, ...data.data.keywords]),
        ];
      }
      this.searchHistories = searchHistories;
    },
  },
};
</script>

<style lang="less" scoped>
.van-search__action {
  color: #fff;
}
</style>