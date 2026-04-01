const Sequelize = require('sequelize')
const dbConfig  = require('../config/database')

const User     = require('../app/models/User')
const Product  = require('../app/models/Product')
const Category = require('../app/models/Category')
const Order    = require('../app/models/Order')

const connection = new Sequelize(dbConfig)

User.init(connection)
Product.init(connection)
Category.init(connection)
Order.init(connection)

User.associate(connection.models)
Product.associate(connection.models)
Category.associate(connection.models)
Order.associate(connection.models)

module.exports = connection
