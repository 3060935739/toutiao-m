<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-wrap" @click="onCommentLike">
          <van-icon
            class="like-icon"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
            :class="{
              liked: comment.is_liking,
            }"
          ></van-icon>
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div>
        <span class="pubdate">{{
          comment.pubdate | dateTime("MM-DD HH:mm")
        }}</span>
        <van-button
          round
          size="mini"
          class="replay-btn"
          @click="$emit('reply-click', comment)"
          >{{ comment.reply_count }} 回复</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deteleCommentLike } from "@/api/comment";

export default {
  name: "CommentItem",
  components: {},
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 回复点赞
    async onCommentLike() {
      const CommentId = this.comment.com_id.toString();
      if (this.comment.is_liking) {
        await deteleCommentLike(CommentId);
        this.comment.like_count--;
      } else {
        await addCommentLike(CommentId);
        this.comment.like_count++;
      }
      this.comment.is_liking = !this.comment.is_liking;
    },
  },
};
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .name {
    font-size: 14px;
    color: #406599;
  }
  .content {
    font-size: 16px;
    color: #222;
  }
  .pubdate {
    font-size: 10px;
    margin-right: 10px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
  }
  .like-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .like-icon.liked {
    color: #ff69b4;
  }
}
</style>
