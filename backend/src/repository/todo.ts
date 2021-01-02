import { ITodoCreateProps, ITodo, Todo } from './model/todo'
import { BaseRepository } from './base'

export class TodoRepository extends BaseRepository<ITodo, Todo, ITodoCreateProps> {
  constructor() {
    super(Todo)
  }
}
