<template>
    <a-layout-sider width="200" style="background: #fff">
        <a-menu
        mode="inline"
        v-model:selectedKeys="selectedKeys2"
        v-model:openKeys="openKeys"
        :style="{ height: '100%', borderRight: 0 }"
        >
        <a-sub-menu key="project">
            <template #title>
            <span>
                <user-outlined />
                项目管理
            </span>
            </template>
            <a-menu-item key="1">项目管理</a-menu-item>
            <a-menu-item key="2">增量/迭代管理</a-menu-item>
            <a-menu-item key="3">团队管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="task">
            <template #title>
            <span>
                <laptop-outlined />
                测试活动
            </span>
            </template>
            <a-menu-item key="4">测试分析</a-menu-item>
            <a-menu-item key="5">测试设计</a-menu-item>
            <a-menu-item key="6">测试实施</a-menu-item>
            <a-menu-item key="7">测试执行</a-menu-item>
            <a-menu-item key="8">评审</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="asset">
            <template #title>
            <span>
                <notification-outlined />
                资产库
            </span>
            </template>
            <a-menu-item key="9">用例库</a-menu-item>
            <a-menu-item key="10">脚本库</a-menu-item>
            <a-menu-item key="11">风险库</a-menu-item>
            <a-menu-item key="12">其他</a-menu-item>
        </a-sub-menu>
        </a-menu>
    </a-layout-sider>
</template>

<script lang="ts">
// import Vue from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: "TheMenu",
  props: {
    msg: String,
  },
  setup() {
      let openKeys = "";
      return {
          openKeys
      }
  }
});
</script>