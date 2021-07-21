import Align from '@/pages/align'
import React from 'react'
import ReactDOM from 'react-dom'
// import moment from "moment"
import "moment/locale/zh-cn"
import { ConfigProvider } from "antd"
import zhCN from "antd/lib/locale-provider/zh_CN"
import RoutersMap from '@/routers/routersMap'
import './assets/icons'
// 公用CSS模块
import 'antd/dist/antd.less'
//暗黑主题
import 'antd/dist/antd.dark.less'
import '@a/less/vars.less'
import '@a/less/restAntd.less'
import '@a/less/common.less'

moment.locale("zh-cn")

if (module.hot) {
  module.hot.accept()
}

// <React.StrictMode>
ReactDOM.render(
  <ConfigProvider locale={zhCN} componentSize="small">
    <RoutersMap />
  </ConfigProvider>
  ,
  document.getElementById('root')
)






