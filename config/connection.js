const Sequelize = require("sequelize")
require('dotenv').config()

if (process.env.JAWSDB_URL) {
   let sequelize = new Sequelize(process.env.JAWSDB_URL);
} 
else {
    let sequelize = new Sequelize("just_tech_news_db",process.env.DB_USER,process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})}

module.exports = sequelize