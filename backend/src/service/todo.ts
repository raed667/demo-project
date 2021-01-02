import { TodoRepository } from '../repository/todo'
import { ITodo, Todo } from '../repository/model/todo'
import { OperationError } from '../common/errors/operation-error'
import { StatusCodes } from 'http-status-codes'
import { produce } from '../kafka'

// A POST request should not contain an id.
export type TodoCreationParams = Omit<Todo, 'id' | 'done' | 'date_created' | 'date_updated'>

interface IGetTodoParams {
  page: number
  pageSize: number
}

export interface ICreateTodoRequest {
  text: string
}

export interface IUpdateTodoRequest {
  done: boolean
}

export class TodoService {
  public async getById(id: string): Promise<ITodo> {
    const todo = await this.repository.findOne({
      where: {
        id,
      },
    })
    if (!todo) {
      throw new OperationError('NOT_FOUND', StatusCodes.NOT_FOUND)
    }
    return todo
  }

  public async get({ page, pageSize }: IGetTodoParams): Promise<Array<ITodo>> {
    const take = pageSize
    const skip = take && page && (page - 1) * take

    return await this.repository.find({
      take,
      skip,
      order: {
        id: 'ASC',
      },
    })
  }

  public async create({ text }: ICreateTodoRequest): Promise<ITodo> {
    try {
      const created = await this.repository.create({
        text,
        done: false,
      })
      produce('todo-created', created.id, JSON.stringify(created))
      return created
    } catch (err) {
      throw new OperationError('UNKNOWN_ERROR', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  public async update(id: string, { done }: IUpdateTodoRequest): Promise<ITodo> {
    try {
      const todo = await this.getById(id)

      if (!todo) {
        throw new OperationError('NOT_FOUND', StatusCodes.NOT_FOUND)
      }

      const updated = await this.repository.update({
        ...todo,
        done,
      })
      produce('todo-updated', updated.id, JSON.stringify(updated))
      return updated
    } catch (err) {
      throw new OperationError('UNKNOWN_ERROR', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  public async delete(id: string) {
    try {
      return await this.repository.delete({
        id,
      })
    } catch (err) {
      throw new OperationError('UNKNOWN_ERROR', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  private get repository() {
    return new TodoRepository()
  }
}
