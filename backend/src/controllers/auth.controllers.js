import User from "../models/user.models.js"
import bycrypt from 'bcryptjs'
import genToken from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup=async (req,res)=>{

    try{
    const {fullName,email,password,profilePic}=req.body

    if (!fullName || !email || !password) return res.status(400).send({message:'fill everything'})


    const user=await User.findOne({email})
    if(user) return res.status(400).send({message:'email already existed'})
    if(password.length<6) return res.status(400).send({message:'password length should be atleast 6'})

    const salt= await bycrypt.genSalt(10)
    const hassedPassword=await bycrypt.hash(password,salt)

    const newUser= new User({
        fullName,
        email,
        password:hassedPassword,
    })

    if (newUser) {
        genToken(newUser._id,res)
        await newUser.save()
        res.status(200).json({success: true,message:'Successfully created account'})
        
    } else {
        res.status(401).json({success: false,message:'invalid user data'})
    }
}
    catch(err){
        console.log(err.message);
        
        res.status(500).json({success: false,message:'Internal error'})
    }

    
}

export const login=async(req,res)=>{

    try {
        const {email,password}=req.body
        if(!email || !password) return res.status(400).send( {message : 'fill everything'})
        const user=await User.findOne({email:email})
        
        if(!user) return res.status(400).json( {message : 'User does not exist'})
        const success=await bycrypt.compare(password,user.password)
        
        if (success) {
            genToken(user._id,res)
            res.status(200).json({message: 'Logged in successfully'})

        } else {
            res.status(400).json({message: 'Invalid credentials'})

        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Invalid data')  
    }

}

export const logout=(req,res)=>{
    try {
        res.cookie('jwt','',{maxAge:0})
        res.status(200).json({message:'logged out successfully'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Internal server error'})
        
    }
}

export const updateProfile=async (req,res) => {
    try {
        const {profilePic}=req.body
        const userId=req.user._id
        
        if(!profilePic){
            return res.status(400).json({message:'Profile pic is required'})
        }
        const updateResponse=await cloudinary.uploader.upload(profilePic)
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:updateResponse.secure_url},{new:true})
        
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:'internal server error'})
    }  
}

export const checkAuth=async (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({message:'internal server error'})
    }
}