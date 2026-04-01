const { Model, DataTypes } = require('sequelize')

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        path: DataTypes.STRING,
      },
      { sequelize }
    )
    return this
  }

  static associate(models) {
    this.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' })
  }

  get url() {
    return `${process.env.APP_URL || 'http://localhost:3001'}/product-file/${this.path}`
  }
}

module.exports = Category
