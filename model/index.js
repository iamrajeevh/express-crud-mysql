'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const process = require('process')
const basename = path.basename(__filename)
const { dbconfig } = require('../config/db.config')
const config = dbconfig
const db = {}

// console.log('dbConfig',dbconfig)
config.define = {
    hooks: {
        beforeCreate: async (model, options) => {
            // if (options.userId != undefined && options.userId != null) {
            //     model.createdBy = options.userId
            // }
            console.log('HelloBeforeCreate')
        },
        beforeUpdate: async (model, options) => {
            // if (options.userId != undefined && options.userId != null) {
            //     model.updatedBy = options.userId
            // }
            console.log('HelloBeforeUpdate')
        },

        afterUpdate: async (model, options) => {
            // console.log("optionsssss++" , options)
            console.log('HelloAfterUpdate')
        },
    },
}
let sequelize
sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)
sequelize.sync().then(function(){
  console.log('DB connection sucessful.');
}, function(err){
  // catch error here
  console.log('DB error',err);

});
console.table(config)

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        )
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model
    })
// console.log('dbbb',db)
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
