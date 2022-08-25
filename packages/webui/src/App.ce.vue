<template>
  <div class="container">
    <NDescriptions :column="1" size="large" label-placement="left">
      <NDescriptionsItem label="登陆状态">
        {{ envs.loginStatus }}
      </NDescriptionsItem>
      <NDescriptionsItem label="当前页面">
        {{ envs.currentPage }}
      </NDescriptionsItem>
      <NDescriptionsItem label="当前环境">
        {{ envs.device }}
      </NDescriptionsItem>
    </NDescriptions>

    <div class="option-container" v-if="envs.isOperate">
      <NInput
        placeholder="请输入ID"
        :disabled="form.started"
        v-model:value="form.userId"
      ></NInput>
      <NButton
        style="margin-top: 5px"
        :disabled="form.started"
        @click="handleStart"
        >{{ form.started ? "正在操作" : "开始" }}</NButton
      >
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
import { NDescriptions, NDescriptionsItem, NButton, NInput } from "naive-ui";
import { isLogin, isPayPage, isPaySubmit } from "@dpa/inject-lib";
import { getOs } from "@alrale/common-lib";

export default defineComponent({
  components: { NDescriptions, NDescriptionsItem, NButton, NInput },
  emits: ["start"],
  setup(props, { emit }) {
    const isPayFor = isPayPage() || isPaySubmit();
    const envs = computed(() => {
      return {
        loginStatus: isLogin() ? "已登陆" : "未登陆",
        currentPage: isPayFor ? "支付页面" : "非支付页面",
        isOperate: isLogin() && isPayPage(),
        device: getOs(),
      };
    });
    const form = ref({
      userId: "",
      started: false,
    });

    const handleStart = () => {
      if (!form.value.userId) {
        return;
      }
      form.value.started = true;
      /**
       * 通过 this.$emit 或者 setup 中的 emit 触发的事件都会通过以 CustomEvents 的形式从自定义元素上派发。额外的事件参数 (payload) 将会被暴露为 CustomEvent 对象上的一个 detail 数组。
       */
      emit("start", form.value.userId);
    };

    return { envs, form, handleStart };
  },
});
</script>

<style>
.container {
  background-color: rgba(38, 38, 38, 0.4);
  border-radius: 3px;
  box-shadow: 0 0 1px #f5f5f5;
  padding: 5px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 20px;
  left: 0;
  z-index: 999;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}
.option-container {
  margin-top: 20px;
}
</style>
