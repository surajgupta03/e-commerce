const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

orderNumber:String,

customer:{
name:String,
email:String,
phone:String
},

items:Array,

shippingAddress:{
address:String,
city:String,
state:String,
zip:String,
country:String
},

subtotal:Number,

shipping:Number,

total:Number,

paymentMethod:String,

status:{
type:String,
default:"Pending"
}

},{timestamps:true})

module.exports = mongoose.model("Order",orderSchema)
