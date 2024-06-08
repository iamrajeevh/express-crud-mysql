module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
      user_name: {
        type: DataTypes.STRING,
      },
      user_email: {
        type: DataTypes.STRING,
      },
      user_mobile: {
        type: DataTypes.STRING,
     },
     password: {
        type: DataTypes.STRING,
     },
     dob:{
        type: DataTypes.DATE,
        required:false
     },
     profile_img:{
      type: DataTypes.STRING,
      required:false
   }
    })
    // to delete user some key from return model
    User.prototype.toJSON = function () {
        var values = Object.assign({}, this.get())
        delete values.userKey
        return values
    }
    // User.sync() //if table not exists creates new
    // User.sync({ force: true }) // forcefully recreate the table
    return User
}
