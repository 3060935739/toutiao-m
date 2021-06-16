<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <!-- :class="{ active: index === 激活的频道 }" -->
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="'十 ' + channel.name"
        class="grid-item"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getChannels, addUserChannel, deleteUserChannel } from "@/api/user";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";

export default {
  name: "ChannelEdit",
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [],
      //控制编辑图标显示状态
      isEdit: false,
    };
  },
  computed: {
    ...mapState(["user"]),
    // 推荐的频道列表
    recommendChannels() {
      // filter方法：过滤数据，根据方法返回的布尔值来收集数据
      return this.allChannels.filter((channel) => {
        // 判断 channel 是否属于用户频道
        return !this.userChannels.find((userChannel) => {
          return userChannel.id === channel.id;
        });
      });
    },
  },
  created() {
    this.loadAllChannels();
  },
  mounted() {},

  methods: {
    async loadAllChannels() {
      const { data } = await getChannels();
      this.allChannels = data.data.channels;
    },

    async onAdd(channel) {
      this.userChannels.push(channel);
      // 数据持久化
      if (this.user) {
        await addUserChannel({
          channels: [
            {
              id: channel.id,
              seq: this.userChannels.length,
            },
          ],
        });
      } else {
        setItem("user-channels", this.userChannels);
      }
    },

    onUserChannelClick(channel, index) {
      if (this.isEdit && index !== 0) {
        //编辑状态，删除频道
        this.deleteChannel(channel, index);
      } else {
        //非编辑状态，进入频道
        this.goChannel(index);
      }
    },

    async deleteChannel(channel, index) {
      if (index <= this.active) {
        this.$emit("update-active", this.active - 1);
      }
      this.userChannels.splice(index, 1);
      // 数据持久化
      if (this.user) {
        await deleteUserChannel(channel.id);
      } else {
        setItem("user-channels", this.userChannels);
      }
    },

    goChannel(index) {
      this.$emit("update-active", index);
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333;
  }
  .grid-item {
    width: 80px;
    height: 43px;
    /deep/.van-grid-item__content {
      background: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/.van-grid-item__icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #bbb;
    }
  }
  .active {
    /deep/.van-grid-item__text {
      color: red !important;
    }
  }
  .van-button{
    width: 50px;
    height: 23px;
  }
}
</style>