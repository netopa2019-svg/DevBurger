const Product  = require('../models/Product')
const Category = require('../models/Category')
const yup      = require('yup')

class ProductController {
  async index(req, res) {
    const { category_id, offer } = req.query
    const where = {}
    if (category_id) where.category_id = category_id
    if (offer !== undefined) where.offer = offer === 'true'
    const products = await Product.findAll({ where, include: [{ model: Category, as: 'category', attributes: ['id','name'] }], order: [['created_at','DESC']] })
    return res.json(products.map(p => ({ ...p.toJSON(), url: p.url })))
  }
  async show(req, res) {
    const product = await Product.findByPk(req.params.id, { include: [{ model: Category, as: 'category' }] })
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
    return res.json({ ...product.toJSON(), url: product.url })
  }
  async store(req, res) {
    const schema = yup.object({ name: yup.string().required(), price: yup.number().required(), category_id: yup.number().required() })
    try { await schema.validate(req.body, { abortEarly: false }) } catch (e) { return res.status(400).json({ error: e.errors }) }
    try {
      const product = await Product.create({ ...req.body, path: req.file?.filename, offer: req.body.offer === 'true' })
      return res.status(201).json({ ...product.toJSON(), url: product.url })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
  async update(req, res) {
    try {
      const product = await Product.findByPk(req.params.id)
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
      const updates = { ...req.body }
      if (req.file) updates.path = req.file.filename
      if (req.body.offer !== undefined) updates.offer = req.body.offer === 'true'
      await product.update(updates)
      return res.json({ ...product.toJSON(), url: product.url })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
  async destroy(req, res) {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
    await product.destroy()
    return res.status(204).send()
  }
}
module.exports = new ProductController()
