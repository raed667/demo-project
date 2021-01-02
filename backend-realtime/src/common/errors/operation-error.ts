export type OperationErrorMessage = 'UNKNOWN_ERROR'

export class OperationError extends Error {
  constructor(message: OperationErrorMessage, readonly status: number) {
    super(message)
  }
}
