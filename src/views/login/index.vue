<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <van-form
      validate-first
      :show-error="false"
      :show-error-message="false"
      ref="loginForm"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        clearable
        icon-prefix="icon"
        left-icon="shouji"
        placeholder="请输入手机号"
        center
        name="mobile"
        :rules="formRules.mobile"
      >
        <template #left-icon>
          <van-icon
            class="iconfont"
            class-prefix="icon"
            name="shouji"
          ></van-icon>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        clearable
        left-icon="smile-o"
        placeholder="请输入验证码"
        center
        name="code"
        :rules="formRules.code"
      >
        <template #left-icon>
          <van-icon
            class="iconfont"
            class-prefix="icon"
            name="yanzhengma"
          ></van-icon>
        </template>
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-btn"
            size="mini"
            round
            :loading="isSendSmsLoading"
            loading-type="spinner"
            @click.prevent="onSendSms"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" size="large">登录</van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";
import { Toast } from "vant";

export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "", //手机号
        code: "", //验证码
      },
      formRules: {
        mobile: [
          { required: true, message: "请填写手机号" },
          {
            pattern:
              /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: "请输入正确手机号",
          },
        ],
        code: [
          { required: true, message: "请输入验证码" },
          {
            pattern: /^\d{6}$/,
            message: "请输入正确验证码",
          },
        ],
      },
      //控制倒计时和发送按钮显示
      isCountDownShow: false,
      isSendSmsLoading: false,
    };
  },
  created() {},
  methods: {
    async onLogin() {
      Toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        const { data } = await login(this.user);
        Toast.success("登录成功");
        //将后端返回的用户登录状态(token等数据)放到Vuex容器中
        this.$store.commit("setUser", data.data);
        this.$router.back()
      } catch (err) {
        Toast.fail("登录失败");
      }
    },
    onFailed(error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: "top",
        });
      }
    },
    async onSendSms() {
      try {
        //校验手机号
        await this.$refs.loginForm.validate("mobile");
        this.isSendSmsLoading = true;
        //验证通过->请求发送验证码
        await sendSms(this.user.mobile);
        //隐藏发送按钮，显示倒计时
        this.isCountDownShow = true;
        //倒计时结束,隐藏倒计时，显示发送按钮，监听倒计时finish处理
      } catch (err) {
        let message = "";
        if (err && err.response && err.response.status === 429) {
          message = "发送太频繁了，稍后重试";
        } else if (err.name === "mobile") {
          message = err.message;
        } else {
          message = "发送失败，稍后重试";
        }
        this.isSendSmsLoading = false;
        this.$toast({
          message,
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.login-btn-wrap {
  padding: 26px 16px;
  .login-btn {
    background-color: #6db4fb;
    border: none;
    border-radius: 5px;
    .van-button__text {
      font-size: 15px;
    }
  }
}
.send-btn {
  width: 76px;
  height: 23px;
  background-color: #ededed;
  .van-button__text {
    font-size: 11px;
    color: #666;
  }
}
</style>