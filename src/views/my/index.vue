<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="myInfo">
      <van-cell class="baseInfo" center :border="false">
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{ currentUser.name }}</div>
        <van-button class="updateBtn" size="small" round to="/user/profile"
          >编辑资料</van-button
        >
      </van-cell>
      <van-grid class="dataInfo" :border="false">
        <van-grid-item class="dataInfoItem">
          <div slot="text" class="textWrap">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="dataInfoItem">
          <div slot="text" class="textWrap">
            <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="dataInfoItem">
          <div slot="text" class="textWrap">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="dataInfoItem">
          <div slot="text" class="textWrap">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 未登录页面 -->
    <div v-else class="notLogin">
      <div @click="$router.push('./login')">
        <img class="mobile" src="./mobile.png" />
      </div>
      <div class="text">登录/注册</div>
    </div>

    <!-- 收藏历史区域 -->
    <van-grid class="navGrid mb-4" :column-num="2">
      <van-grid-item class="navGridItem" icon="star-o" text="收藏" />
      <van-grid-item class="navGridItem" icon="underway-o" text="历史" />
    </van-grid>

    <van-cell class="mb-4" title="消息通知" is-link to="/" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentUser } from "@/api/user";

export default {
  name: "MyIndex",
  components: {},
  props: {},
  data() {
    return {
      // 当前登录用户信息
      currentUser: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadCurrentUser();
  },
  methods: {
    async loadCurrentUser() {
      const { data } = await getCurrentUser();
      this.currentUser = data.data;
    },
    onLogout() {
      this.$dialog
        .confirm({
          title: "退出提示",
          message: "确认退出吗？",
        })
        .then(() => {
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style scoped lang="less">
.myInfo {
  background: url("./banner.png") no-repeat;
  background-size: cover;
  .baseInfo {
    box-sizing: border-box;
    height: 115px;
    padding-top: 38px;
    padding-bottom: 11px;
    background-color: unset;
    .avatar {
      box-sizing: border-box;
      height: 66px;
      width: 66px;
      border: 1px solid #fff;
      margin-right: 11px;
    }
    .name {
      color: #fff;
      font-size: 15px;
    }
    .updateBtn {
      height: 16px;
      font-size: 10px;
      color: #666;
    }
  }
  /deep/ .van-grid-item__content {
    background-color: unset;
  }
  .dataInfo {
    padding: 0 16px;
    color: #fff;
    .dataInfoItem {
      height: 65px;
      .textWrap {
        text-align: center;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 11px;
        }
      }
    }
  }
}
.notLogin {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 180px;
  background: url(./banner.png) no-repeat;
  background-size: cover;
  .mobile {
    width: 66px;
    height: 66px;
  }
  .text {
    color: #fff;
    font-size: 14px;
  }
}
/deep/.navGrid {
  .navGridItem {
    height: 70px;
    .van-icon {
      font-size: 22px;
    }
    .van-icon-star-o {
      color: #ed6768;
    }
    .van-icon-underway-o {
      color: #ffa42c;
    }
    .van-grid-item__text {
      font-size: 14px;
      color: #333;
    }
  }
}
.logout-cell {
  text-align: center;
  font-size: 15px;
  color: #d86262;
}
.mb-4 {
  margin-bottom: 4px;
}
</style>