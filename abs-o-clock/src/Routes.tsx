import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Room from './Pages/Room'

interface Props {}

const Routes = (props: Props) => {
  return (
    <Router>
      <Switch>
        <Route path='/r/:roomKey'>
          <Room />
        </Route>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route>
          <h2>Not Found</h2>
        </Route>
      </Switch>
    </Router>
  )
}
export default Routes
