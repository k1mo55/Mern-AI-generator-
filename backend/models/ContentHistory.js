import { subscribe } from "diagnostics_channel";
import mongoose, { mongo } from "mongoose";

const ContentHistorySchema = new mongoose.Schema({
    user:{  
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{  
        type:String,
        required:true
    },
},
{
    timestamps:true

}
)

const ContentHistory = mongoose.model("ContentHistory",ContentHistorySchema);

export default Payment