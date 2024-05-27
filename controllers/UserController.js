const sequelize = require('sequelize')
const db = require("../model/index")

const UserSchema = db.users;



const getAllUsers = async (reqs, res ) => {
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

const createUser = async (reqs, res ) => {
    try{
        const {user_name,user_email,user_mobile,password,dob} = reqs.body;
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

const getUserDetail = async (reqs, res) => {
    try{

        // reqs.body
        //reqs.param
        // reqs.query
        const userId = reqs.params.id;
        console.log('userIdDD',reqs.params.id)
        const userData = await UserSchema.findOne({
            where: {
                id:  userId   
            }
        });
        res.status(200).json({
            'status' :'success',
            'status_code':200,
            'data':userData
        });
    }catch(e){
        console.log('error while getting user detaills',e)
    }
}

module.exports = {getAllUsers,createUser,getUserDetail}