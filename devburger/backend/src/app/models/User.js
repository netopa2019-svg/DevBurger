const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name:          DataTypes.STRING,
        email:         DataTypes.STRING,
        password_hash: DataTypes.STRING,
        password:      DataTypes.VIRTUAL,
        admin:         DataTypes.BOOLEAN,
        phone:         DataTypes.STRING,
        address:       DataTypes.TEXT,
      },
      { sequelize }
    )

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8)
      }
    })

    return this
  }

  static associate(models) {}

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}

module.exports = User
