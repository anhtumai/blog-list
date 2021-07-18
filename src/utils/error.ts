class ClientError extends Error {
    statusCode: number

    constructor(statusCode: number, message: string) {
        super(message)
        this.statusCode = statusCode
        this.name = 'ClientError'
    }
}

export default ClientError
