const { Model, DataTypes } = require('sequelize')

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name:        DataTypes.STRING,
        price:       DataTypes.DECIMAL(10, 2),
        description: DataTypes.TEXT,
        path:        DataTypes.STRING,
        offer:       DataTypes.BOOLEAN,
        category_id: DataTypes.INTEGER,
      },
      { sequelize }
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' })
  }

  get url() {
    return `${process.env.APP_URL || 'http://localhost:3001'}/product-file/${this.path}`
  }
}

module.exports = Product
