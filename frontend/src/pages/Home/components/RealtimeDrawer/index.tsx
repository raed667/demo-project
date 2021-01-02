import { Divider, Drawer } from '@material-ui/core'
import React from 'react'
import useWebSocket from 'react-use-websocket'
import { useStyles } from './style'

type Todo = {
  id: string
  text: string
  done: boolean
}

type Payload = {
  todo: Todo
  timestamp: string
}

export const RealtimeDrawer = () => {
  const classes = useStyles()

  const [messages, setMessages] = React.useState<Todo[]>([])

  const { readyState, lastJsonMessage } = useWebSocket('ws://localhost/wss/')

  React.useEffect(() => {
    if (!lastJsonMessage) return
    const payload = JSON.parse(lastJsonMessage) as Payload

    setMessages((prev) => {
      const isInList = !!prev.find((u) => u.id === payload.todo.id)
      if (isInList) return prev

      return [...prev, payload.todo]
    })
  }, [lastJsonMessage])

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="right"
    >
      <div className={classes.toolbar} />
      <Divider />
      {readyState === 0 && <div>Connecting...</div>}
      {readyState === 2 || (readyState === 3 && <div>Closed</div>)}
      {readyState === 1 && (
        <div>
          {messages.map((todo) => (
            <div key={todo.id}>
              {todo.text}
              <Divider />
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}
