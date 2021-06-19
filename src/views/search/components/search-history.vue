<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories', [])">全部删除</span>
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      v-for="(history, index) in searchHistories"
      :key="index"
      :title="history"
      @click="onDelete(history, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
// import { setItem } from "@/utils/storage";
export default {
  name: "SearchHistory",
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteShow: false,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onDelete(history, index) {
      // 删除状态，执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1);
        // 数据持久化
        // setItem("search-histories", this.searchHistories);
        return;
      }
      // 非删除状态，执行搜索
      this.$emit("search", history);
    },
  },
};
</script>

<style lang="less" scoped>
</style>