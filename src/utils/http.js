import axios from 'axios'

let http = axios.create({
    // 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    baseURL:"http://localhost:8088/springboot/",
    timeout:5000,
    // 携带验证信息,cookie
    withCredentials:true,
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    transformRequest:function(data){
        return data;
    }
});
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default http
