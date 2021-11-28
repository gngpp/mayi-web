import axios from 'axios'
import router from '@/router/routers'
import {Notification} from 'element-ui'
import store from '../store'
import {setPoint,getToken, setToken} from '@/utils/auth'
import Config from '@/settings'
import Cookies from 'js-cookie'
import {decryptByCBC, encryptByCBC} from '@/utils/aesEncrypt'
import {openSignature, secretSignature} from "@/utils/apiSign"
import da from "element-ui/src/locale/lang/da";
// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      // config.headers['Authorization'] = getToken()
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers.Authorization = getToken()
    }
    // let data = config.data
    // if (data) {
    //   config.data = encryptByCBC(config.data)
    // }

    if (Config.signaturePattern === 'OPEN') {
      config.params = {
        // 合并参数
        ...config.params,
        ...openSignature()
      }
    }
    if (Config.signaturePattern === 'SECRET') {
      config.headers['Content'] = secretSignature()
    }
    config.headers['pattern'] = Config.signaturePattern
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    let decode
    // 尝试解码
    try {
      decode = decryptByCBC(response.data);
    } catch (e) {
      console.log(e)
    }
    // 解码成功
    if (decode) {
      response.data = JSON.parse(decode)
    }
    // 引用
    const code = response.status
    // // 待测试
    if (response.headers.Authorization) {
      const token = 'Bearer ' + response.headers.Authorization
      console.log('response' + token)
      setToken(token, true)
    }
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message,
        message: '请求状态码异常',
        duration: 5000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let data
    try {
      let decode
      // 支持解码
      try {
        // 尝试解码
        decode = decryptByCBC(error.response.data);
      } catch (e) {
      }
      // 解码成功
      if (decode) {
        error.response.data = JSON.parse(decode)
      }
      // 引用
      data = error.response.data
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '错误',
          message: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    let errMsg
    let errCode
    // data
    if (data) {
      errMsg = data.errMsg
      errCode = data.errCode
    }
    // 401 status 未认证
    if (error.response.status === 401 || errCode === 401) {
      const oauthError = error.response.data.error
      const oauthErrorDescription = error.response.data.error_description
      if (getToken()) {
        // 用户登录界面提示
        setPoint('point', 401)
        store.dispatch('LogOut').then(() => {
          location.reload()
        })
      } if (errMsg === undefined) {
        if (oauthError !== undefined && oauthErrorDescription !== undefined) {
          Notification.warning({
            title: oauthError,
            message: oauthErrorDescription,
            duration: 5000
          })
        } else {
          Notification.warning({
            title: "warning",
            message: "Authentication failed",
            duration: 5000
          })
        }
      } else {
        Notification.error({
          title: 'error',
          message: errMsg,
          duration: 5000
        })
      }
    }

    // 403 status 无权访问
    if (error.response.status === 403 || errCode === 403) {
      Notification.error({
        title: 'error',
        message: 'Have no right to access',
        duration: 5000
      })
      router.push({ path: '/403' })
    }

    // 400 status 坏的请求
    if (error.response.status === 400 || errCode === 400) {
      const authErrorMsg = error.response.data.error
      if (authErrorMsg !== undefined) {
        Notification.error({
          title: 'error',
          message: authErrorMsg,
          duration: 5000
        })
      } else if (errMsg != undefined) {
        Notification.error({
          title: 'error',
          message: errMsg,
          duration: 5000
        })
      } else {
        Notification.error({
          title: 'error',
          message: 'request failed!',
          duration: 3000
        })
      }
    }

    // 500 status 服务器错误
    if (error.response.status === 500) {
      if (errMsg !== undefined) {
        Notification.error({
          title: 'error',
          message: errMsg,
          duration: 5000
        })
      } else {
        Notification.error({
          title: 'error',
          message: 'API request failed！',
          duration: 5000
        })
      }
    }
    // 503 status 服务不可用
    if (error.response.status === 503 || errCode === 503) {
      const errorMsg = error.response.data.error
      if (errorMsg !== undefined) {
        Notification.error({
          title: 'error',
          message: errorMsg,
          duration: 5000
        })
      } else {
        Notification.error({
          title: 'error',
          message: 'Service Unavailable',
          duration: 5000
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
