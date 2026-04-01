const jwt  = require('jsonwebtoken')
const User = require('../models/User')

class SessionController {
  async store(req, res) {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' })
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })
    const ok = await user.checkPassword(password)
    if (!ok) return res.status(401).json({ error: 'Senha incorreta' })
    const token = jwt.sign({ id: user.id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, admin: user.admin } })
  }
}
module.exports = new SessionController()
