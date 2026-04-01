'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id:            { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name:          { type: Sequelize.STRING,  allowNull: false },
      email:         { type: Sequelize.STRING,  allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING,  allowNull: false },
      admin:         { type: Sequelize.BOOLEAN, defaultValue: false },
      phone:         { type: Sequelize.STRING },
      address:       { type: Sequelize.TEXT },
      created_at:    { type: Sequelize.DATE, allowNull: false },
      updated_at:    { type: Sequelize.DATE, allowNull: false },
    })

    await queryInterface.createTable('categories', {
      id:         { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name:       { type: Sequelize.STRING,  allowNull: false },
      path:       { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    })

    await queryInterface.createTable('products', {
      id:          { type: Sequelize.INTEGER,       primaryKey: true, autoIncrement: true, allowNull: false },
      name:        { type: Sequelize.STRING,        allowNull: false },
      price:       { type: Sequelize.DECIMAL(10,2), allowNull: false },
      description: { type: Sequelize.TEXT },
      path:        { type: Sequelize.STRING },
      offer:       { type: Sequelize.BOOLEAN, defaultValue: false },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    })

    await queryInterface.createTable('orders', {
      id:             { type: Sequelize.INTEGER,       primaryKey: true, autoIncrement: true, allowNull: false },
      user_id:        { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      products:       { type: Sequelize.JSONB,         allowNull: false },
      total:          { type: Sequelize.DECIMAL(10,2), allowNull: false },
      status:         { type: Sequelize.STRING,        defaultValue: 'Pedido Realizado' },
      payment_method: { type: Sequelize.STRING },
      address:        { type: Sequelize.TEXT },
      stripe_id:      { type: Sequelize.STRING },
      created_at:     { type: Sequelize.DATE, allowNull: false },
      updated_at:     { type: Sequelize.DATE, allowNull: false },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('orders')
    await queryInterface.dropTable('products')
    await queryInterface.dropTable('categories')
    await queryInterface.dropTable('users')
  },
}
