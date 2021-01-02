export type OperationErrorMessage = 'UNKNOWN_ERROR' | 'DUPLICATE' | 'NOT_FOUND'

export class OperationError extends Error {
  constructor(message: OperationErrorMessage, readonly status: number) {
    super(message)
  }
}
