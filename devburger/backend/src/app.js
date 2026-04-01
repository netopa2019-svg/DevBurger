const express = require('express')
const cors = require('cors')
const path = require('path')
const routes = require('./routes')

class App {
  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    }))
    this.app.use(express.json())
    this.app.use(
      '/product-file',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    )
    this.app.get('/health', (req, res) => res.json({ status: 'ok' }))
  }

  routes() {
    this.app.use(routes)
  }
}

module.exports = new App().app
