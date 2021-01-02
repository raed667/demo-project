import React from 'react'
import { useStyles } from './style'

type Props = {
  resetErrorBoundary: () => void
}
export const ErrorFallback = ({ resetErrorBoundary }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <p>Something went wrong:</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
