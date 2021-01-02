import { Box, Container } from '@material-ui/core'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { About } from './pages/About'
import { Home } from './pages/Home'

export const App = () => (
  <Router>
    <Navigation />
    <Container maxWidth="md">
      <Box my={4}>
        <Switch>
          <Route exact strict path="/">
            <Home />
          </Route>
          <Route exact strict path="/about">
            <About />
          </Route>
        </Switch>
      </Box>
    </Container>
  </Router>
)
