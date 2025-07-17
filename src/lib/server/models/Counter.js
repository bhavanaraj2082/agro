import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
    counter:{
        type:Number
    }
},
{
    collection:'counter',
    timestamps:true
})

const Counter = mongoose.models.Counter || mongoose.model("Counter",counterSchema)
export default Counter