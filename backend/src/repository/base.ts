import { FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { DBError } from '../common/errors/db-error'
import { IBaseModel, BaseModel } from './model/base'
import { getDbConnection } from './database'
import { getRedisClient } from '../redis'
import logger from '../common/logger'
import { redisCacheHitCounter } from '../common/monitoring'

/**
 * The generic type arguments for BaseRepository seem a little convoluted,
 * but there's a strategy in mind. TypeORM uses classes and class decorators
 * to set up establish ORM models and model relations.
 *
 * By only accepting and producing the interface version of models, we can keep
 * the class models from propagating throughout the app and allows repositories
 * to run on pure data structures
 */
export abstract class BaseRepository<
  // Properties in an existing record
  Props extends IBaseModel,
  // Class representing TypeORM model
  Class extends BaseModel & Props,
  // Properties required to create this record
  CreateProps
> {
  constructor(private readonly classFn: new () => Class) {}

  public async findOne(options: FindOneOptions<Class>): Promise<Props | undefined> {
    try {
      // @ts-expect-error we can have an id in the where clause
      const id = options?.where?.id || null
      if (id != null) {
        const cached = await this.getFromCache(id)
        if (cached) return cached
      }
    } catch (error) {
      logger.warn(`Unable to reach Redis, error=${error}`)
    }
    const result = await this.execute((repo) => repo.findOne(options))
    if (result) {
      this.addToCache(result)
    }
    return result
  }

  public async find(options: FindManyOptions<Class>): Promise<Props[]> {
    const results = await this.execute((repo) => repo.find(options))
    results?.forEach((result) => this.addToCache(result))
    return results
  }

  public async create(model: CreateProps): Promise<Props> {
    const now = new Date()

    const result = await this.execute((repo) =>
      repo.save({
        ...model,
        date_created: now,
        date_updated: now,
      })
    )
    this.addToCache(result)
    return result
  }

  public async update(model: Props): Promise<Props> {
    const result = await this.execute((repo) =>
      repo.save({
        ...model,
        date_updated: new Date(),
      } as CreateProps & Props)
    )
    this.addToCache(result)
    return result
  }

  public async delete(options: FindConditions<Class>): Promise<void> {
    await this.execute((repo) => repo.delete(options))
    if (options.id) {
      this.removeCache(`${options.id}`)
    }
    return
  }

  private async execute<P>(fn: (repo: Repository<Class>) => Promise<P>) {
    try {
      const repo = await this.getRepository()
      return await fn(repo)
    } catch (err) {
      throw new DBError(err.message, err)
    }
  }

  private async getRepository(): Promise<Repository<Class>> {
    const connection = await getDbConnection()
    return connection.getRepository<Class>(this.classFn)
  }

  private addToCache(result: Props) {
    const redis = this.cache
    if (redis) {
      redis.set(
        `${this.classFn.name}-${result.id}`,
        JSON.stringify(result),
        'EX',
        60 * 5 // Expire after 5 minutes
      )
    }
  }
  private async getFromCache(id: string): Promise<Props | null> {
    const redis = this.cache
    if (redis) {
      const cached = await redis.get(`${this.classFn.name}-${id}`)
      if (cached) {
        redisCacheHitCounter.inc({ counter: 1 })
        // We have to trust that the redis cache is properly formatted
        return JSON.parse(cached) as Props
      }
    }
    return null
  }

  private removeCache(id: string) {
    const redis = this.cache
    if (redis) {
      redis.del(`${this.classFn.name}-${id}`)
    }
  }

  private get cache() {
    const redis = getRedisClient()
    return redis.status === 'ready' ? redis : null
  }
}
