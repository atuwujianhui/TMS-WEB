import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as Icons from '@ant-design/icons-vue';
import axios from 'axios';
// import { Tool } from "@/util/tool";
// import { message } from 'ant-design-vue';

// 创建应用
const app = createApp(App)
app.use(store)
    .use(router)
    .use(Antd)
    .mount('#app')

// 全局使用图标
const icons: any = Icons;
for (const i in icons) {
    app.component(i, icons[i]);
}

/* ---------- axios配置 - 开始 ---------- */
// 全局配置axios请求域
axios.defaults.baseURL = process.env.VUE_APP_SERVER;

/**
 * axios拦截器 - 请求
 */
axios.interceptors.request.use(
    function (config) {
        // console.log('请求参数：', config);
        // const token = store.state.user.token;
        // if (Tool.isNotEmpty(token)) {
        //     config.headers.token = token;
        //     console.log("请求headers增加token:", token);
        // }
        return config;
    }, error => {
        return Promise.reject(error);
    }
);

/**
 * axios拦截器 - 响应
 */
axios.interceptors.response.use(function (response) {
    // console.log('返回结果：', response);
    return response;
}, error => {
    // console.log('返回错误：', error);
    // const response = error.response;
    // const status = response.status;
    // if (status === 401) {
    //     // 判断状态码是401 跳转到首页或登录页
    //     console.log("未登录，跳到首页");
    //     store.commit("setUser", {});
    //     message.error("未登录或登录超时");
    //     router.push('/');
    // }
    return Promise.reject(error);
});
/* ---------- axios配置 - 结束 ---------- */


// console.log("环境：", process.env.NODE_ENV)