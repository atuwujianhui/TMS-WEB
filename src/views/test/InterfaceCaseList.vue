<template>
  <a-layout>
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
      
    <a-layout-content
      :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
      <!-- 列表 -->
      <a-table 
          :columns="columns" 
          :data-source="interfaceCaseList"
          :rowKey="record => record.id"
          :loading="loading"
          :pagination="pagination"
          :scroll="{ x: 1500, y: 300 }"
          @change="handleTableChange"
        >
        <template #edit>
          <a-space size="small">
            <a @click="edit">编辑</a>
            <a @click="del">删除</a>
          </a-space>
        </template>
        <template >
          <div id="components-pagination-demo-mini">
            <a-pagination size="small" :total="50" />
            <a-pagination size="small" :total="50" show-size-changer show-quick-jumper />
            <a-pagination size="small" :total="50" :show-total="total => `Total ${total} items`" />
          </div>
        </template>
      </a-table>
      <!-- 表单 -->
      <a-modal
        title="编辑接口测试用例"
        v-model:visible="modalVisible"
        :confirm-loading="modalLoading"
        ok-text="确认"
        cancel-text="取消"
        :closable="false"
        @ok="save"
      >
        <p>{{ modalText }}</p>
      </a-modal>
    </a-layout-content>
  </a-layout>
  
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, createVNode } from "vue";
import axios from "axios";
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
// import qs from 'qs';

const columns = [
  { title: '编号', width: 60, dataIndex: 'code', key: 'code', fixed: 'left' },
  { title: '用例标题', width: 200, dataIndex: 'name', key: 'name', fixed: 'left' },
  { title: '项目名称', dataIndex: 'systemName', key: 'systemName', width: 200 },
  { title: '迭代名称', dataIndex: 'iterationName', key: 'iterationName', width: 200 },
  { title: 'URI', dataIndex: 'uri', key: 'uri', width: 200 },
  { title: '接口类型', dataIndex: 'interfaceType', key: 'interfaceType', width: 80 },
  { title: '状态', dataIndex: 'state', key: 'state', width: 80 },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 80,
    slots: { customRender: 'edit' },
  },
];

interface DataItem {
  id: number;
  code: number;
  name: string;
  systemName: string;
  iterationName: string;
  uri: string;
  interfaceType: number;
  state: number;
}

// const data: DataItem[] = [];
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i,
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }

export default defineComponent({
  name: 'InterfaceCaseList',
  components: {},
  setup() {

    // ***********************************************************
    // ************************** 列表 ***************************
    // ***********************************************************

    /**
     * 变量定义
     */
    // 查询条件表单
    const queryForm = ref();
    // 接口用例列表
    const interfaceCaseList = ref();
    // 分页
    const pagination = ref({
      current: 1,
      pageSize: 2,
      total: 0
    });
    // 是否加载
    const loading = ref(true);

    /**
     * 构建请求参数
     */
    const getParams = () => {
      const params = {
        current: pagination.value.current,
        pageSize: pagination.value.pageSize,
        // TODO: 查询条件，待扩展
        // otherParam: queryForm.value.name
      };

      return params;
    }

    /**
     * 数据查询
     **/
    const handleQuery = (pageEvent = false) => {
      // 正在加载标志
      loading.value = true;
      // 清空接口测试用例列表
      interfaceCaseList.value = [];
      // 获取请求参数
      const params = getParams()
      axios.defaults.headers.post['Content-Type'] = "application/json;charset=UTF-8";
      // 查询接口测试用例
      // GET请求方式，固定格式
      // axios.get("http://localhost:8081/interfaceCase/find", {params: myParams}) 
      // 其他，比如“x-www-form-urlencoded”等方式，待研究
      // axios.post("http://localhost:8081/interfaceCase/find")
      // axios.post("http://localhost:8081/interfaceCase/find", params)
      // axios.post("http://localhost:8081/interfaceCase/find2", JSON.stringify(params))
      // POST-JSON请求方式
      axios.post("/interfaceCase/find", params).then((response) => {
        const datas: DataItem[] = [];
        for (let data of response.data.content.list) {
          datas.push({
            "id": data.id,
            "code": data.code, 
            "name": data.name,
            "systemName": "", // data.system.name,
            "iterationName": "", //data.iteration.name,
            "uri": data.uri,
            "interfaceType": data.interfaceType,
            "state": data.state
          })
        }
        // 更新接口测试用例列表
        interfaceCaseList.value = datas;
        console.log(datas);
        // 非翻页，即表示查询，当前页要重置
        if (!pageEvent) {
          pagination.value.current = 1;
        }
        pagination.value.total = response.data.content.total;
        // 加载完成
        loading.value = false;
      }
    )};
    
    /**
     * 表格点击页码时触发
     */
    const handleTableChange = (page: any) => {
      // 更新页码
      pagination.value.current = page.current;
      pagination.value.pageSize = page.pageSize;
      // 触发分页查询
      handleQuery(true);
    };

    // ***********************************************************
    // ************************** 表单 ***************************
    // ***********************************************************

    /**
     * 变量定义
     */
    // 显示内容（测试使用，无实际业务含义）
    const modalText = ref<string>('Content of the modal');
    // 对话框隐藏/显示控制
    const modalVisible = ref<boolean>(false);
    const modalLoading = ref<boolean>(false);

    /**
     * 点击“编辑”
     */
    const edit = () => {
      modalVisible.value = true;
    };

    /**
     * 编辑保存
     */
    const save = () => {
      modalText.value = 'The modal will be closed after two seconds';
      modalLoading.value = true;
      setTimeout(() => {
        modalVisible.value = false;
        modalLoading.value = false;
      }, 2000);
    };
    
    /**
     * 删除
     */
    const del = () => {
      Modal.confirm({
        title: '提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除操作不可恢复，确认继续？',
        okText: "确认",
        cancelText: "取消",
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log('Oops errors!'));
        },
        // onCancel() {},
      });
    };

    // ***********************************************************
    // ************************ 周期函数 *************************
    // ***********************************************************

    /**
     * 组件挂载后执行查询，即初始化
     */
    onMounted(() => {
      // 加载完毕后触发查询条件
      handleQuery();
    })
    
    // ***********************************************************
    // ************************** 返回 ***************************
    // ***********************************************************
    return {

      // ------------ 列表 ---------------
      // 查询条件
      queryForm,
      // 接口测试用例清单
      interfaceCaseList,
      // 字段定义
      columns,
      // 分页
      pagination,
      // 加载中
      loading,
      // 翻页
      handleTableChange,
      // ------------ 表单 ------------
      // 测试文本，无业务含义
      modalText,
      // 显示隐藏对话框控制变量
      modalVisible,
      modalLoading,
      // 显示对话框
      edit,
      // 点击确认操作
      save,
      // 删除
      del
    };
  }
});
</script>

<style scoped>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 5px 5px !important;
}
</style>