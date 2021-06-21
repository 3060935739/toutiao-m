<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
    </van-nav-bar>
    <!-- 当前评论项 -->
    <CommentItem :comment="comment" />

    <!-- 所有评论回复 -->
    <!-- <van-cell title="所有回复" /> -->

    <CommentList :source="comment.com_id" type="c" :list="commentList" />
    <!-- 底部区域 -->
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="common-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>

    <!-- 发布回复 -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment
        :target="comment.com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from "./comment-item";
import CommentList from "./comment-list";
import PostComment from "./post-comment";

export default {
  name: "CommentReply",
  components: { CommentItem, CommentList, PostComment },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      isPostShow: false,
      commentList: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onPostSuccess(comment) {
      this.commentList.unshift(comment);
      this.comment.reply_count++;
      this.isPostShow = false;
    },
  },
};
</script>

<style scoped lang="less">
.article-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  height: 40px;
  background-color: #fff;
  border-top: 1px solid #dee;
  .common-btn {
    flex: 3;
    margin: 0 15px 0 5px;
  }
}
</style>
