const { Model, DataTypes } = require('sequelize')

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id:        DataTypes.INTEGER,
        products:       DataTypes.JSONB,
        total:          DataTypes.DECIMAL(10, 2),
        status:         DataTypes.STRING,
        payment_method: DataTypes.STRING,
        address:        DataTypes.TEXT,
        stripe_id:      DataTypes.STRING,
      },
      { sequelize }
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
  }
}

module.exports = Order
