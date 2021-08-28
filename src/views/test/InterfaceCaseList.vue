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
      <!-- 查询条件表单 -->
      <a-form layout="inline" :model="queryForm">
        <a-form-item>
          <a-input v-model:value="queryForm.name" placeholder="用例名称"></a-input>
        </a-form-item>
        <a-form-item>
          <a-space size="small">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button type="primary" @click="add">新增</a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <!-- 查询结果列表 -->
      <a-table 
          :columns="columns" 
          :data-source="interfaceCaseList"
          :rowKey="record => record.id"
          :loading="loading"
          :pagination="pagination"
          :scroll="{ x: 1500, y: 300 }"
          @change="handleTableChange"
        >
        <template #edit="{text, record}">
          <a-space size="small">
            <a @click="edit(record)">编辑</a>
            <a @click="del(record.id)">删除</a>
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
      <!-- 模式对话框 -->
      <a-modal
        title="编辑接口测试用例"
        v-model:visible="modalVisible"
        :confirm-loading="modalLoading"
        ok-text="确认"
        cancel-text="取消"
        :closable="false"
        @ok="save"
        :maskClosable="false"
      >
        <!-- 表单 -->
        <a-form :model="formData" :label-col="{span: 4}" :wrapper-col="{span: 14}">
          <a-form-item label="用例编号">
            <a-input v-model:value="formData.code" />
          </a-form-item>
          <a-form-item label="用例标题">
            <a-input v-model:value="formData.name" />
          </a-form-item>
          <a-form-item label="URI">
            <a-input v-model:value="formData.uri" />
          </a-form-item>
          <a-form-item label="接口类型">
            <a-radio-group v-model:value="formData.interfaceType">
              <a-radio value="0">Http</a-radio>
              <a-radio value="1">Socket</a-radio>
              <a-radio value="2">Webservice</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="状态">
            <a-switch v-model:checked="formData.state" :checkedValue="1" :unCheckedValue="0"/>
            <!-- <a-switch :checkedValue="1"/> -->
          </a-form-item>
        </a-form>
      </a-modal>
      
    </a-layout-content>
  </a-layout>
  
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, createVNode, reactive, toRaw, UnwrapRef } from "vue";
import axios from "axios";
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Tool } from "@/utils/tool";

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

// 使用any方便，但是建议使用接口类型
// interface DataItem {
//   id: number;
//   code: number;
//   name: string;
//   uri: string;
//   interfaceType: string;
//   state: number;
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
    queryForm.value = {};
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
        name: (queryForm.value.name ? queryForm.value.name : null)
      };

      return params;
    }

    /**
     * 数据查询
     **/
    const query = (pageEvent = false) => {
      // 正在加载标志
      loading.value = true;
      // 清空接口测试用例列表
      interfaceCaseList.value = [];
      if (!pageEvent) {
        pagination.value.current = 1;
      }
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
        // 使用any方便，但是建议使用接口类型
        // const datas: DataItem[] = [];
        const datas: any[] = [];
        // 非翻页，即表示查询，当前页要重置
        const data = response.data;
        if (!data.success) {
          message.error(data.message);
          // 加载完成
          loading.value = false;
          return
        }
        for (let item of data.content.list) {
          datas.push({
            "id": item.id,
            "code": item.code, 
            "name": item.name,
            "uri": item.uri,
            "interfaceType": String(item.interfaceType),  // 单选框不能识别数值（number），需要转化为字符串（string）
            "state": item.state
          })
        }
        // 更新接口测试用例列表
        interfaceCaseList.value = datas;
        // 更新列表总记录数
        pagination.value.total = parseInt(response.data.content.total);
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
      query(true);
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
    const formData = ref({});

    /**
     * 点击“新增”
     */
    const add = () => {
      modalVisible.value = true;
    }
    /**
     * 点击“编辑”
     */
    const edit = (record: any) => {
      modalVisible.value = true;
      formData.value = Tool.copy(record);
      console.log(record);
    };

    /**
     * 编辑保存
     */
    const save = () => {
      modalLoading.value = true;
      axios.post("/interfaceCase/save", formData.value).then((response) => {
        const data = response.data;
        // 判断是否更新成功
        if (data.success) {
          modalVisible.value = false;
          // 重新加载列表
          query(false);
        } else {
          message.error(data.message);
        }
        modalLoading.value = false;
      })
    };
    
    /**
     * 删除
     */
    const del = (id: any) => {
      Modal.confirm({
        title: '提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除操作不可恢复，确认继续？',
        okText: "确认",
        cancelText: "取消",
        onOk() {
          axios.delete("/interfaceCase/delete/" + id).then((response) => {
            const data = response.data;
            // 判断是否更新成功
            if (data.success) {
              modalVisible.value = false;
              modalLoading.value = false;
              // 重新加载列表
              query(false);
            }
          });
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
      query();
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
      // 表单数据
      formData,
      // 查询
      query,
      // 新增
      add,
      // 编辑
      edit,
      // 保存（新增/编辑）
      save,
      // 删除
      del
    };
  }
});
</script>

<style>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 5px 5px !important;
}
</style>