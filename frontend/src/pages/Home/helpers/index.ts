import axios from '../../../utils/axios'

export const getTodoList = async (page = 1, pageSize = 100) => {
  const { data } = await axios.get('/todos', {
    params: {
      page,
      pageSize,
    },
  })
  return data
}

export const deleteTodo = async (ids: string[]) => {
  const promises = ids.map((id) => axios.delete(`/todos/${id}`))
  return await Promise.allSettled(promises)
}

export const createTodo = async (text: string) => {
  return await axios.post('/todos', {
    text,
  })
}

export const updateTodo = async (id: string, done: boolean) => {
  return await axios.post(`/todos/${id}`, {
    done,
  })
}
