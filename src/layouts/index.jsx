import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { Layout } from 'antd'
import { Provider } from 'react-redux'
import stores from '@stores'
import './style.less'

const Layouts = ({ children }) => {
  const history = useHistory()
  const { location } = history
  const PrefixCls = 'layouts'
  if (['/404', '/401', '/login'].includes(location.pathname)) {
    return (
      <Fragment>
        {children}
      </Fragment>
    )
  }

  return <Layout className={PrefixCls}>
    <Provider store={stores}>
      {children}
    </Provider>
  </Layout>

}

export default hot(Layouts)

