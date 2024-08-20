import { subscribe } from "diagnostics_channel";
import mongoose, { mongo } from "mongoose";

const paymentSchema = new mongoose.Schema({
    user:{  
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    refrence:{  
        type:String,
        required:true
    },
    currency:{  
        type:String,
        required:true
    },
    status:{  
        type:String,
        required:true,
        default:"pending"
    },
    subscriptionPlan:{  
        type:String,
        required:true
    },
    amount:{  
        type:Number,
        default:0
    },
    monthlyRequestCount:{  
        type:Number,
        required:true
    },
    



},
{
    timestamps:true

}
)

const Payment = mongoose.model("Payment",paymentSchema);

export default Payment