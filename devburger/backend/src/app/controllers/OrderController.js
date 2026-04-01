const Order = require('../models/Order')
const User  = require('../models/User')

const STATUS = ['Pedido Realizado', 'Em Preparação', 'Saiu para Entrega', 'Entregue', 'Cancelado']

class OrderController {
  async store(req, res) {
    const { products, total, payment_method, address } = req.body
    if (!products?.length) return res.status(400).json({ error: 'Produtos obrigatórios' })
    try {
      const order = await Order.create({ user_id: req.userId, products, total, payment_method, address, status: 'Pedido Realizado' })
      return res.status(201).json(order)
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
  async index(req, res) {
    const orders = await Order.findAll({ where: { user_id: req.userId }, order: [['created_at','DESC']] })
    return res.json(orders)
  }
  async show(req, res) {
    const order = await Order.findOne({ where: { id: req.params.id, user_id: req.userId } })
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' })
    return res.json(order)
  }
  async adminIndex(req, res) {
    const orders = await Order.findAll({
      include: [{ model: User, as: 'user', attributes: ['id','name','email'] }],
      order: [['created_at','DESC']]
    })
    return res.json(orders)
  }
  async updateStatus(req, res) {
    const { status } = req.body
    if (!STATUS.includes(status)) return res.status(400).json({ error: 'Status inválido', valid: STATUS })
    try {
      const order = await Order.findByPk(req.params.id)
      if (!order) return res.status(404).json({ error: 'Pedido não encontrado' })
      await order.update({ status })
      return res.json(order)
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
}
module.exports = new OrderController()
