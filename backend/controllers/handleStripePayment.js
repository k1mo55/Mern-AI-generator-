import Stripe from 'stripe'
import User from '../models/User.js';
import Payment from '../models/payment.js';



const handleStripePayment = async ( req, res )=>{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    try{
        const { amount , subscriptionPlan } = req.body;
        const user = await User.findById( req.userId );
        const paymentIntent = await stripe.paymentIntents.create({
            amount:Number(amount)*100,
            currency:"usd",
            metadata:{
                userId :user._id.toString(),
                userEmail:user.email,
                subscriptionPlan
            }
        })
        
        if (!paymentIntent.client_secret) {
            return res.status(500).json({ message: "Error creating payment intent" });
          }
        res.status(200).json({
            clientSecret:paymentIntent.client_secret,
            paymentId:paymentIntent.id,
            metadata:paymentIntent.metadata
        })


    }catch(err){
        res.status(500).json({ message:"Internal server error" })
    }
}

const handleFreeSubscription = async ( req , res )=>{
    try{
        const user = await User.findById( req.userId );
       
        if(!shouldRenewSubcriptionPlan(user)){
            return res.status(403).json( { message:"subscription not due yet" } )
        }
        const newPayment = await Payment.create({
            user:user._id,
            subscriptionPlan:'Free',
            amount:0,
            status:'success',
            refrence:Math.random().toString(36).substring(7),
            monthlyRequestCount:5,
            currency:"usd"
        })

        user.subscriptionPlan = 'Free';
        user.monthlyRequestCount =5;
        user.apiRequestCount =0
        user.nextBillingDate = calculateNextBillingDate();
        user.payments.push(newPayment._id)
        await user.save()
        


        res.status(200).json({ message:"subscription plan updated" ,user })
    }catch(err){
        res.status(500).json( { message:"Inteernal server error" } )
    }
}

const verifyPayment = async (req , res)=>{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    try{
        const { paymentId } = req.params
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
        if (!paymentIntent) {
            return res.status(400).json({ message: "payment intent not found" });
          }
        if (paymentIntent.status == "succeeded") {
            return res.status(400).json({
            message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
            });
        }
        
        const{ subscriptionPlan ,userEmail ,userId }= paymentIntent.metadata
        
        const amount = paymentIntent.amount
        const currency = paymentIntent.currency
        
        const newPayment = await Payment.create({
            user:userId,
            email:userEmail,
            subscriptionPlan,
            amount,
            currency,
            status:"success",
            refrence:paymentId,
            monthlyRequestCount:0
        })
        
        if(subscriptionPlan =='Basic'){
            const user = await User.findByIdAndUpdate(req.userId,{
                subscriptionPlan,
                trialPeriod :0,
                nextBillingDate : calculateNextBillingDate(),
                apiRequestCount:0,
                monthlyRequestCount:50,
                $addToSet:{ payments:newPayment._id },
                subscriptionPlan:"Basic"
            },{ new:true });
            res.status(200).json(user)
        }else if(subscriptionPlan =='Premium'){
            const user = await User.findByIdAndUpdate(req.userId,{
                subscriptionPlan,
                trialPeriod :0,
                nextBillingDate : calculateNextBillingDate(),
                apiRequestCount:0,
                monthlyRequestCount:100,
                $addToSet:{ payments:newPayment._id },
                subscriptionPlan:"Premium"
            },{ new:true });
            res.status(200).json(user)
           
        }
        


    }catch(err){
        
        res.status(500).json({message:"Intrnal server error"})

    }



}




const calculateNextBillingDate = () => {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return oneMonthFromNow;
  };
  const shouldRenewSubcriptionPlan = (user) => {
    const today = new Date();
    return !user.nextBillingDate || user.nextBillingDate <= today;
  };
export default {
    handleStripePayment,
    handleFreeSubscription,
    verifyPayment

}