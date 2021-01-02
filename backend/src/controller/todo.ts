import {
  Body,
  Controller,
  Query,
  Get,
  Post,
  Path,
  Route,
  SuccessResponse,
  Tags,
  Delete,
} from 'tsoa'
import { ITodo, Todo } from '../repository/model/todo'
import { TodoService, TodoCreationParams, IUpdateTodoRequest } from '../service/todo'

@Route('todos')
@Tags('Todo')
export class TodoController extends Controller {
  @Get('{id}')
  public async getById(@Path() id: string): Promise<Todo> {
    return await this.service.getById(id)
  }

  @Get()
  public async get(@Query() page = 1, @Query() pageSize = 10): Promise<Array<Todo>> {
    return await this.service.get({ page, pageSize })
  }

  @Post()
  @SuccessResponse('201', 'Created')
  public async create(@Body() requestBody: TodoCreationParams): Promise<ITodo> {
    this.setStatus(201)
    return await this.service.create(requestBody)
  }

  @Post('{id}')
  public async updateStatus(
    @Path() id: string,
    @Body() requestBody: IUpdateTodoRequest
  ): Promise<ITodo> {
    return await this.service.update(id, requestBody)
  }

  @Delete('{id}')
  public async delete(@Path() id: string) {
    return await this.service.delete(id)
  }

  private get service() {
    return new TodoService()
  }
}
