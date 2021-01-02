import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { Todo } from '../model/todo'

const todos: Todo[] = [
  {
    id: '823a3ec3-d3dc-417d-9931-efc1f5bd296a',
    text: 'Buy milk',
    done: false,
    date_created: new Date(),
    date_updated: new Date(),
  },
  {
    id: '1eac85e0-abee-4f6e-a330-bd8758bb52c4',
    text: 'Fix window',
    done: false,
    date_created: new Date(),
    date_updated: new Date(),
  },
  {
    id: '54ad1235-7ce2-4289-83d1-0c36e619fdad',
    text: 'Finish project',
    done: false,
    date_created: new Date(),
    date_updated: new Date(),
  },
  {
    id: 'ea11861c-eefd-4202-8e98-0053a40d89ec',
    text: 'Survive 2020',
    done: true,
    date_created: new Date(),
    date_updated: new Date(),
  },
]

export class insertTodos1606672821869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.name === 'prod') {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    }

    await queryRunner.createTable(
      new Table({
        name: 'todos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          { name: 'text', type: 'text', isNullable: false },
          { name: 'done', type: 'boolean', isNullable: false, default: false },
          { name: 'date_created', type: 'timestamp', isNullable: false },
          { name: 'date_updated', type: 'timestamp', isNullable: false },
        ],
      }),
      true
    )
    queryRunner.manager.createQueryBuilder().insert().into('todos').values(todos).execute()
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .where('id IN (:...ids)', { id: todos.map((todo) => todo.id) })
      .execute()

    await queryRunner.dropTable('todos')
  }
}
