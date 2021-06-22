<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/article-item";
import { debounce } from "lodash";

export default {
  name: "ArticleList",
  components: { ArticleItem },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      articles: [],
      loading: false,
      finished: false,
      //获取下一页数据的时间戳
      timestamp: null,
      //下拉刷新的loading状态
      isRefreshLoading: false,
      refreshSuccessText: "",
      scrollTop: 0,
    };
  },
  computed: {},
  created() {},
  mounted() {
    const articleList = this.$refs["article-list"];
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop;
    }, 50);
  },
  activated() {
    this.$refs["article-list"].scrollTop = this.scrollTop;
  },
  deactivated() {},
  methods: {
    async onLoad() {
      const { data } = await getArticles({
        channel_id: this.channel.id, //频道id
        timestamp: this.timestamp || Date.now(),
        with_top: 1,
      });
      const { results } = data.data;
      this.articles.push(...results);
      this.loading = false;
      if (results.length) {
        this.timestamp = data.data.pre_timestamp;
      } else {
        this.finished = true;
      }
    },
    async onRefresh() {
      const { data } = await getArticles({
        channel_id: this.channel.id, //频道id
        timestamp: Date.now(),
        with_top: 1,
      });
      const { results } = data.data;
      this.articles.unshift(...results);
      this.isRefreshLoading = false;
      this.refreshSuccessText = `更新了${results.length}条数据`;
    },
  },
};
</script>

<style lang="less" scoped>
.article-list {
  position: fixed;
  overflow-y: auto;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
}
</style>