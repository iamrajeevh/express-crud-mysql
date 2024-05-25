const sequelize = require('sequelize')
const db = require("../model/index")

const UserSchema = db.users;



const getAllUsers = async (req, res ) => {
    try{
        const users = await UserSchema.findAll();
        res.status(200).json({
            'status' :'success',
            'status_code':200,
            'data':users
        });
    }catch(e){
        console.log(e)
    }
}

const createUser = async (req, res ) => {
    try{
        const {user_name,user_email,user_mobile,password,dob} = req.body;
        const users = await UserSchema.create({
            user_name : user_name,
            user_email : user_email,
            user_mobile : user_mobile,
            password : password,
            dob : dob,
        }).then((user) => {
            res.status(200).json({
                'status' :'success',
                'status_code':200,
                'data':user
            })
        }).catch((error) => {
            res.status(400).json({
                'status' :'error',
                'status_code':400,
                'data':error
            });
        })
    }catch(e){
        console.log(e)
    }
}


module.exports = {getAllUsers,createUser}