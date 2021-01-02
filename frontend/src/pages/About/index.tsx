import { Button, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { useStyles } from './style'

export const About = () => {
  const classes = useStyles()

  return (
    <Paper className={classes.wrapper}>
      <Typography variant="h4" color="textSecondary" align="center" gutterBottom>
        Welcome to an extremely over-engineered todo app!
      </Typography>
      <div className={classes.container}>
        <Typography variant="h5">Check under the hood:</Typography>
      </div>
      <div className={classes.container}>
        <Button
          href="http://localhost:3003/d/xWDzB1AGz/"
          target="_blank"
          variant="contained"
          color="primary"
        >
          Grafana
        </Button>
        <Button href="http://localhost:9090/" target="_blank" variant="contained" color="secondary">
          Prometheus
        </Button>
      </div>
    </Paper>
  )
}
