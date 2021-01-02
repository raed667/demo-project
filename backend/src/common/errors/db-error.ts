import { QueryFailedError } from 'typeorm'

export class DBError extends Error {
  public readonly code: string

  constructor(message: string, public readonly queryError: QueryFailedError) {
    super(message)
    this.code = ((queryError as unknown) as { code: string }).code
  }
}
