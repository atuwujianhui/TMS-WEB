<template>
  <a-list
    class="demo-loadmore-list"
    :loading="loading"
    item-layout="horizontal"
    :data-source="dataList"
  >
    <template #loadMore>
      <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
        <a-spin v-if="loadingMore" />
        <a-button v-else @click="loadMore">loading more</a-button>
      </div>
    </template>
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a>edit</a>
          <a>more</a>
        </template>
        <a-list-item-meta
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        >
          <template #title>
            <a href="https://www.antdv.com/">{{ item.name.last }}</a>
          </template>
          <template #avatar>
            <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </template>
        </a-list-item-meta>
        <div>content</div>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from "axios";

export default defineComponent({
  setup() {

    const interfaceCaseList = ref();

    onMounted(() => {
      axios.post("http://localhost:8888/findAllInterfaceCase").then(
        (response) => {
          interfaceCaseList.value = response.data.datas;
        }
      )
    })
    
    return {
      interfaceCaseList
    };
  },
});
</script>
<style scoped>
.demo-loadmore-list {
  min-height: 350px;
}
</style>