const { Router } = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')

const UserController      = require('./app/controllers/UserController')
const SessionController   = require('./app/controllers/SessionController')
const ProductController   = require('./app/controllers/ProductController')
const CategoryController  = require('./app/controllers/CategoryController')
const OrderController     = require('./app/controllers/OrderController')
const StripeController    = require('./app/controllers/StripeController')

const authMiddleware = require('./app/middlewares/auth')
const adminMiddleware = require('./app/middlewares/admin')

const upload = multer(multerConfig)
const routes = new Router()

// ── Públicas ─────────────────────────────────────────────────
routes.post('/users',    UserController.store)
routes.post('/sessions', SessionController.store)

// ── Autenticadas ─────────────────────────────────────────────
routes.use(authMiddleware)

// Usuário
routes.get('/users/me', UserController.show)
routes.put('/users',    UserController.update)

// Produtos (leitura pública após auth)
routes.get('/products',     ProductController.index)
routes.get('/products/:id', ProductController.show)

// Categorias (leitura pública após auth)
routes.get('/categories',     CategoryController.index)
routes.get('/categories/:id', CategoryController.show)

// Pedidos
routes.post('/orders',    OrderController.store)
routes.get('/orders',     OrderController.index)
routes.get('/orders/:id', OrderController.show)

// Stripe
routes.post('/create-checkout-session', StripeController.store)

// ── Admin ────────────────────────────────────────────────────
routes.use(adminMiddleware)

// Produtos Admin
routes.post('/products',       upload.single('file'), ProductController.store)
routes.put('/products/:id',    upload.single('file'), ProductController.update)
routes.delete('/products/:id', ProductController.destroy)

// Categorias Admin
routes.post('/categories',       upload.single('file'), CategoryController.store)
routes.put('/categories/:id',    upload.single('file'), CategoryController.update)
routes.delete('/categories/:id', CategoryController.destroy)

// Pedidos Admin
routes.get('/admin/orders',         OrderController.adminIndex)
routes.put('/orders/:id/status',    OrderController.updateStatus)

module.exports = routes
