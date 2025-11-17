export class RemoteSecurityError extends Error {
  constructor(
    message: string,
    public readonly url: string
  ) {
    super(message)
    this.name = 'RemoteSecurityError'
  }
}
