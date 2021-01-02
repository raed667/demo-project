import { AppBar, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { useStyles } from './style'

export const Navigation = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              Demo App
            </Link>

            <Link to="/about" className={classes.link}>
              About this app
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
