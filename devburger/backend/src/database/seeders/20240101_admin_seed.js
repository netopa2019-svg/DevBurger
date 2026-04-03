'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface) => {
    const passwordHash = await bcrypt.hash('admin123', 8)
    await queryInterface.bulkInsert('users', [{
      name:          'Admin DevBurger',
      email:         'netopa2008@hotmail.com',
      password_hash: passwordHash,
      admin:         true,
      phone:         null,
      address:       null,
      created_at:    new Date(),
      updated_at:    new Date(),
    }], { ignoreDuplicates: true })
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', {
      email: 'netopa2008@hotmail.com'
    })
  }
}
