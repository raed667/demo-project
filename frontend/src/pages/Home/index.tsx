import { Button, Paper, Typography } from '@material-ui/core'
import {
  ColDef,
  DataGrid,
  RowModel,
  SelectionChangeParams,
  ValueFormatterParams,
  ValueGetterParams,
} from '@material-ui/data-grid'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '../../components/ErrorFallback'
import { AddDialog } from './components/AddDialog'
import { DeleteDialog } from './components/DeleteDialog'
import { RealtimeDrawer } from './components/RealtimeDrawer'
import { createTodo, deleteTodo, getTodoList, updateTodo } from './helpers'
import { useStyles } from './style'

export const Home = () => {
  const classes = useStyles()

  const [todoList, setTodoList] = React.useState<RowModel[]>([])
  const [selected, setSelected] = React.useState<string[]>([])
  const [isLoading, setLoading] = React.useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await getTodoList()
        setTodoList(data)
      } catch (error) {
        console.log({ error })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onSelectionChange = (param: SelectionChangeParams) => {
    setSelected(param.rowIds.map((id) => id.toString()))
  }

  const onAcceptDelete = async () => {
    setLoading(true)
    await deleteTodo(selected)
    setTodoList((old) => old.filter((u) => !selected.includes(`${u.id}`)))
    setLoading(false)
    setDeleteDialogOpen(false)
  }

  const onSubmitAdd = async ({ text }: { text: string }) => {
    setLoading(true)
    await createTodo(text)

    const data = await getTodoList()
    setTodoList(data)

    setLoading(false)
    setAddDialogOpen(false)
  }

  const columns: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 130,
      valueGetter: (params: ValueGetterParams) => params?.value?.toString().substr(0, 8) || '',
      disableClickEventBubbling: true,
    },
    { field: 'text', headerName: 'Todo', width: 250, disableClickEventBubbling: true },
    {
      field: 'done',
      headerName: 'Done',
      width: 250,
      disableClickEventBubbling: true,
      renderCell: (params: ValueFormatterParams) => {
        const onClick = () => {
          updateTodo(`${params.row.id}`, !params.value)
          setTodoList((old) =>
            old.map((u) => {
              if (u.id === `${params.row.id}`) {
                u.done = !params.value
              }
              return u
            })
          )
        }
        return (
          <Button
            onClick={onClick}
            variant="contained"
            color={params.value ? 'secondary' : 'primary'}
            size="small"
            fullWidth
            startIcon={
              params.value ? (
                <CheckCircleOutlineOutlinedIcon />
              ) : (
                <RadioButtonUncheckedOutlinedIcon />
              )
            }
          >
            {params.value?.toString()}
          </Button>
        )
      },
    },
  ]

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        alert('no')
      }}
    >
      <RealtimeDrawer />
      <Paper className={classes.wrapper}>
        <Typography variant="h4" color="textSecondary" align="center" gutterBottom>
          Welcome to the over-complicated Todo list!
        </Typography>

        <Typography variant="body1" gutterBottom>
          A very basic React interface to a CRUD Todo list.
        </Typography>

        <div className={classes.tableWrapper}>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              disabled={isLoading}
              onClick={() => setAddDialogOpen(true)}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={!selected.length || isLoading}
              onClick={() => {
                setDeleteDialogOpen(true)
              }}
            >
              Delete
            </Button>
          </div>
          <DataGrid
            rows={todoList}
            columns={columns}
            onSelectionChange={onSelectionChange}
            checkboxSelection
            autoHeight
            hideFooter
          />
        </div>
      </Paper>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onSubmit={onAcceptDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={isLoading}
      />
      <AddDialog
        isOpen={isAddDialogOpen}
        onSubmit={onSubmitAdd}
        onCancel={() => setAddDialogOpen(false)}
        isLoading={isLoading}
      />
    </ErrorBoundary>
  )
}
