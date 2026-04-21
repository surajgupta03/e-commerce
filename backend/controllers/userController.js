const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { fallbackUsers } = require("../data/fallbackStore")

const JWT_SECRET = process.env.JWT_SECRET || "nexa-dev-secret"

function sanitizeUser(user){
return {
id:user._id,
name:user.name,
email:user.email,
role:user.role
}
}

exports.register = async(req,res)=>{
try{
const {name,email,password} = req.body

if(!name || !email || !password){
return res.status(400).json({message:"Name, email, and password are required"})
}

const hash = await bcrypt.hash(req.body.password,10)

const user = new User({
name:req.body.name,
email:req.body.email,
password:hash
})

await user.save()

res.status(201).json({message:"User registered"})
} catch(error){
const exists = fallbackUsers.find((user)=> user.email === req.body.email)

if(exists){
return res.status(400).json({message:"User already exists"})
}

const fallbackUser = {
_id:`fallback-user-${Date.now()}`,
name:req.body.name,
email:req.body.email,
password:req.body.password,
role:"user"
}

fallbackUsers.push(fallbackUser)
res.status(201).json({message:"User registered"})
}

}

exports.login = async(req,res)=>{
const {email,password} = req.body

if(!email || !password){
return res.status(400).json({message:"Email and password are required"})
}

try{

const user = await User.findOne({email:req.body.email})

if(!user) return res.status(404).json({message:"User not found"})

const valid = await bcrypt.compare(req.body.password,user.password)

if(!valid) return res.status(401).json({message:"Wrong password"})

const token = jwt.sign({id:user._id,email:user.email,role:user.role,name:user.name},JWT_SECRET,{expiresIn:"7d"})

return res.json({token,user:sanitizeUser(user)})
} catch(error){
const user = fallbackUsers.find((item)=> item.email === email)

if(!user || user.password !== password){
return res.status(401).json({message:"Invalid email or password"})
}

const token = jwt.sign({id:user._id,email:user.email,role:user.role,name:user.name},JWT_SECRET,{expiresIn:"7d"})

return res.json({token,user:sanitizeUser(user)})
}

}

exports.getProfile = async(req,res)=>{
try{
const user = await User.findById(req.user.id).select("-password")

if(!user){
return res.status(404).json({message:"User not found"})
}

return res.json(user)
} catch(error){
const user = fallbackUsers.find((item)=> item._id === req.user.id || item.email === req.user.email)

if(!user){
return res.status(404).json({message:"User not found"})
}

return res.json(sanitizeUser(user))
}
}
