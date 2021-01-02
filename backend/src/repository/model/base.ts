import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export interface IBaseModel {
  id: string
  date_created: Date
  date_updated: Date
}

export class BaseModel implements IBaseModel {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @CreateDateColumn()
  public date_created!: Date

  @UpdateDateColumn()
  public date_updated!: Date
}
