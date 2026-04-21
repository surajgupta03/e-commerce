const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "nexa-dev-secret"

function auth(req,res,next){

const header = req.headers.authorization || ""
const token = header.startsWith("Bearer ") ? header.slice(7) : header

if(!token) return res.status(401).json({message:"Access denied"})

try{

const verified = jwt.verify(token,JWT_SECRET)

req.user = verified

next()

}

catch{
res.status(401).json({message:"Invalid token"})
}

}

function adminOnly(req,res,next){
if(req.user?.role !== "admin"){
return res.status(403).json({message:"Admin access required"})
}

next()
}

module.exports = auth
module.exports.adminOnly = adminOnly
