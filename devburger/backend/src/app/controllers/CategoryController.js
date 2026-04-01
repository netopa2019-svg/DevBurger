// CategoryController.js
const Category = require('../models/Category')
const yup      = require('yup')

class CategoryController {
  async index(req, res) {
    const cats = await Category.findAll({ order: [['name','ASC']] })
    return res.json(cats.map(c => ({ ...c.toJSON(), url: c.url })))
  }
  async show(req, res) {
    const cat = await Category.findByPk(req.params.id)
    if (!cat) return res.status(404).json({ error: 'Categoria não encontrada' })
    return res.json({ ...cat.toJSON(), url: cat.url })
  }
  async store(req, res) {
    const schema = yup.object({ name: yup.string().required() })
    try { await schema.validate(req.body) } catch (e) { return res.status(400).json({ error: e.errors }) }
    try {
      const existing = await Category.findOne({ where: { name: req.body.name } })
      if (existing) return res.status(400).json({ error: 'Categoria já existe' })
      const cat = await Category.create({ name: req.body.name, path: req.file?.filename })
      return res.status(201).json({ ...cat.toJSON(), url: cat.url })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
  async update(req, res) {
    try {
      const cat = await Category.findByPk(req.params.id)
      if (!cat) return res.status(404).json({ error: 'Categoria não encontrada' })
      const updates = { ...req.body }
      if (req.file) updates.path = req.file.filename
      await cat.update(updates)
      return res.json({ ...cat.toJSON(), url: cat.url })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
  async destroy(req, res) {
    const cat = await Category.findByPk(req.params.id)
    if (!cat) return res.status(404).json({ error: 'Categoria não encontrada' })
    await cat.destroy()
    return res.status(204).send()
  }
}
module.exports = new CategoryController()
