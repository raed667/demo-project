import { Column, Entity } from 'typeorm'
import { BaseModel, IBaseModel } from './base'

export interface ITodoCreateProps {
  text: string
  done: boolean
}

export interface ITodo extends ITodoCreateProps, IBaseModel {}

@Entity('todos')
export class Todo extends BaseModel implements ITodo {
  @Column({
    nullable: false,
    type: 'text',
  })
  public text!: string

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
  })
  public done!: boolean
}
