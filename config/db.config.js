exports.dbconfig = {
    host: "localhost",
    username: "root",
    password: "codefire",
    database: "express_sql",
    dialect: "mysql", 
    pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
    };