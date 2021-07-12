import http from 'http'
import app from './app'

const PORT = 3003

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
