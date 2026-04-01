require('dotenv').config()

const databaseUrl = process.env.DATABASE_URL

console.log('DATABASE_URL existe?', !!databaseUrl)
console.log('DATABASE_URL início:', databaseUrl ? databaseUrl.substring(0, 30) : 'UNDEFINED')

module.exports = databaseUrl
  ? {
      dialect: 'postgres',
      url: databaseUrl,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      define: { timestamps: true, underscored: true, underscoredAll: true },
      logging: false,
    }
  : {
      dialect: 'postgres',
      host:     process.env.DB_HOST || 'localhost',
      port:     process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'devburger',
      define: { timestamps: true, underscored: true, underscoredAll: true },
      logging: false,
    }
