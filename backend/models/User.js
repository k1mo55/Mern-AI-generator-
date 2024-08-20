import { subscribe } from "diagnostics_channel";
import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{  
        type:String,
        required:true
    },
    email:{  
        type:String,
        required:true
    },
    password:{  
        type:String,
        required:true
    },
    trialActive:{  
        type:Boolean,
        default:true
    },
    trialExpires:{  
        type:Date,
        
    },
    trialPeriod:{   
        type:Number,
        default:3
    },
    subscription:{  
        type:String,
        enum:['Trial','Free','Basic','Premium']
    },
    apiRequestCount:{  
        type:Number,
        default:0
    },
    monthlyRequestCount:{  
        type:Number,
        default:0
    },
    NextBillingDate:{  
        type:Date,
    },
    payments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Payment"

        }
    ],
    history:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Histroy"

        }
    ],



},{
    timestamps:true

}
)

const User = mongoose.model("User",UserSchema);

export default User