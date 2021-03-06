import React, { Suspense } from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import routers from './index'
import Layouts from '@/layouts'

const RoutersMap = () => {
  return (
    <Router>
      <Switch>
        {/* <Route path="/login" exact component={ Login } /> */}
        <Route path="/" render={() => (
          <Layouts>
            <Switch>
              <Suspense fallback={'loading...'}>
                {
                  routers.map((item, index) => <Route key={index} path={item.path} exact component={item.component} />)
                }
              </Suspense>
            </Switch>
          </Layouts>
        )} />

        {/* <Redirect to="/login" /> */}
      </Switch>
    </Router>
  )
}

export default RoutersMap