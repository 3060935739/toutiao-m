<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="article-wrap">
      <!-- 标题 -->
      <h1 class="title">{{ article.title }}</h1>

      <van-cell center class="userInfo">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image
          slot="icon"
          class="avatar"
          round
          fit="cover"
          :src="article.aut_photo"
        />
        <div slot="label" class="pubdate">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-button
          class="followBtn"
          round
          :type="article.is_followed ? 'default' : 'info'"
          :icon="article.is_followed ? '' : 'plus'"
          :loading="isFollowLoading"
          @click="onFollow"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>

      <!-- 正文 -->
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>

      <!-- 文章评论列表 -->
      <CommentList
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      />
    </div>

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
      <van-icon
        class="bottomIcon"
        size="25"
        name="comment-o"
        :badge="totalCommentCount"
        color="#777"
      />
      <van-icon
        class="bottomIcon"
        size="25"
        :name="article.is_collected ? 'star' : 'star-o'"
        :color="article.is_collected ? 'orange' : '#777'"
        @click="onCollected"
      />
      <van-icon
        class="bottomIcon"
        size="25"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="article.attitude === 1 ? 'hotpink' : ''"
        @click="onLike"
      />
      <van-icon
        class="bottomIcon"
        size="25"
        name="share"
        color="#777"
      ></van-icon>
    </div>

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment :target="articleId" @post-success="onPostSuccess" />
    </van-popup>

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <CommentReply
        v-if="isReplyShow"
        :comment="replyComment"
        :articleId="articleId"
        @close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import "./github-markdown.css";
import {
  getArticleById,
  collectArticle,
  uncollectArticle,
  likeArticle,
  unlikeArticle,
} from "@/api/article";
import { ImagePreview } from "vant";
import { addFollow, deleteFollow } from "@/api/user";
import CommentList from "./components/comment-list.vue";
import PostComment from "./components/post-comment.vue";
import CommentReply from "./components/comment-reply.vue";

export default {
  name: "ArticleIndex",
  components: { CommentList, PostComment, CommentReply },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {},
      // 关注用户按钮的loading状态
      isFollowLoading: false,
      isPostShow: false,
      // 文章评论列表
      commentList: [],
      totalCommentCount: 0,
      isReplyShow: false,
      replyComment: {},
    };
  },
  computed: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    // 加载文章详情
    async loadArticle() {
      const { data } = await getArticleById(this.articleId);
      this.article = data.data;
      // 数据改变影响视图更新(DOM数据)不是立即的，
      // 如果需要在修改数据之后马上操作被该数据影响的视图的DOM,需要把代码放到$nextTick中
      this.$nextTick(() => {
        this.handlePerviewImage();
      });
    },

    // 处理图片预览
    handlePerviewImage() {
      const articleContent = this.$refs["article-content"];
      const imgs = articleContent.querySelectorAll("img");
      const imgPaths = [];
      imgs.forEach((img, index) => {
        imgPaths.push(img.src);
        img.onclick = () => {
          ImagePreview({
            images: imgPaths,
            startPosition: index,
          });
        };
      });
    },

    // 关注/取消关注用户
    async onFollow() {
      this.isFollowLoading = true;
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id);
        this.$toast({
          message: "取消关注",
          position: "top",
        });
      } else {
        await addFollow(this.article.aut_id);
        this.$toast({
          message: "关注成功",
          position: "top",
        });
      }
      this.article.is_followed = !this.article.is_followed;
      this.isFollowLoading = false;
    },

    // 收藏/取消收藏文章
    async onCollected() {
      this.$toast.loading({
        message: "操作中...",
        forbidClick: true,
      });
      if (this.article.is_collected) {
        await uncollectArticle(this.articleId);
      } else {
        await collectArticle(this.articleId);
      }
      this.article.is_collected = !this.article.is_collected;
      this.$toast.success(
        `${this.article.is_collected ? "收藏成功" : "取消收藏"}`
      );
    },

    async onLike() {
      this.$toast.loading({
        message: "操作中...",
        forbidClick: true,
      });
      if (this.article.attitude === 1) {
        await unlikeArticle(this.articleId);
        this.article.attitude = -1;
      } else {
        await likeArticle(this.articleId);
        this.article.attitude = 1;
      }
      this.$toast.success(
        `${this.article.attitude === 1 ? "点赞成功" : "取消点赞"}`
      );
    },

    onPostSuccess(comment) {
      this.commentList.unshift(comment);
      this.totalCommentCount++;
      this.isPostShow = false;
    },

    onReplyClick(comment) {
      this.replyComment = comment;
      this.isReplyShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin-top: 46px;
  margin-bottom: 0;
}

.userInfo {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .followBtn {
    width: 85px;
    height: 29px;
  }
}

ul {
  list-style: unset;
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}
.app-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
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
  .bottomIcon {
    flex: 1;
    .van-info {
      right: unset;
    }
  }
}
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 41px;
  background-color: #fff;
  overflow-y: auto;
}
</style>