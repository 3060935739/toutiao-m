<template>
  <div class="post-comment">
    <van-field
      v-model="message"
      autosize
      type="textarea"
      maxlength="100"
      placeholder="请输入评论"
      show-word-limit
    />
    <van-button
      round
      @click="onPost"
      type="info"
      size="small"
      :disabled="!message"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from "@/api/comment";

export default {
  name: "PostComment",
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPost() {
      this.$toast.loading({
        message: "发布中",
        forbidClick: true,
      });
      const { data } = await addComment({
        target: this.target.toString(),
        content: this.message,
        art_id: this.articleId ? this.articleId.toString() : null,
      });
      this.$emit("post-success", data.data.new_obj);
      this.$toast.success("发布成功");
      this.message = "";
    },
  },
};
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  align-items: center;
  padding: 14px;
}
</style>
