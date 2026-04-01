// ============================================================
// UserController.js
// ============================================================
const User = require('../models/User')
const yup  = require('yup')

class UserController {
  async store(req, res) {
    const schema = yup.object({ name: yup.string().required(), email: yup.string().email().required(), password: yup.string().min(6).required() })
    try { await schema.validate(req.body, { abortEarly: false }) } catch (e) { return res.status(400).json({ error: e.errors }) }
    try {
      const exists = await User.findOne({ where: { email: req.body.email } })
      if (exists) return res.status(400).json({ error: 'Email já cadastrado' })
      const user = await User.create({ ...req.body, admin: false })
      return res.status(201).json({ id: user.id, name: user.name, email: user.email, admin: user.admin })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
  async show(req, res) {
    const user = await User.findByPk(req.userId, { attributes: ['id','name','email','admin','phone','address'] })
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
    return res.json(user)
  }
  async update(req, res) {
    try {
      const user = await User.findByPk(req.userId)
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
      await user.update(req.body)
      return res.json({ id: user.id, name: user.name, email: user.email })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
}
module.exports = new UserController()
