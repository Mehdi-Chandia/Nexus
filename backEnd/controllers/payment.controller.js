import Meeting from "../models/meeting.model.js";
import Payment from "../models/transaction.model.js";
import stripe from "../services/stripe.service.js";
import {getIo} from "../socket/socket.js";
import {onlineUsers} from "../socket/onlineUsers.js";
import Notification from "../models/notification.model.js";


export async function createPayment(req, res) {
    try {
        const loggedInUser=req.user;
        const {id} = req.params;
        // console.log('meetingId',id);
        const {amount} = req.body;

        if(!amount){
            return res.status(400).json({
                message:"Amount required"
            });
        }
        if(amount<100){
            return res.status(400).json({
                message:"Minimum amount is 100"
            });
        }

        const meeting = await Meeting.findById(id);
        if (!meeting) {
            return res.status(404).json({
                error: 'Meeting not found.',
            })
        }
        const entrepreneurId=meeting.entrepreneurId;

        const payment=await Payment.create({
            investorId:loggedInUser.id,
            entrepreneurId,
            meetingId:id,
            amount,
            paymentStatus:'pending'
        })

        const session=await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:[
                {
                    price_data:{
                        currency:"USD",
                        product_data:{
                            name:'startup Investment'
                        },
                        unit_amount:amount * 100
                    },
                    quantity:1,
                }
            ],
            metadata:{
                paymentId:payment._id.toString()
            },
            mode:"payment",
            success_url:
                `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:
                `${process.env.FRONTEND_URL}/payment-cancel`
        })
        payment.stripeSessionId=session.id;
        await payment.save();

        const newNotification=await Notification.create({
            userId:entrepreneurId?._id,
            type:'Amount Investment',
            message:`${req?.user?.username} sent investment ${amount}`,
            relatedId: meeting._id,
            relatedModel: "Meeting",
            isRead: false
        })

        const io=getIo();
        const receiverSocketId=onlineUsers[entrepreneurId?._id];

        if(receiverSocketId){
            io.to(receiverSocketId).emit(
                "new-notification",
                newNotification
            )

        }

        if(receiverSocketId){
            io.to(receiverSocketId).emit(
                "dashboard-update",
                {
                    type:'payment-sent',
                }
            )
        }

        return res.status(200).json({
            status:"success",
            url:session.url,
        })
    }catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message});
    }
}


export const stripeWebhook=async(req,res)=>{

    const sig=req.headers["stripe-signature"];

    let event;

    try{

        event=stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("webhook hit");
        console.log(event.type);

    }catch(error){

        return res.status(400).send(error.message);

    }

    if(event.type==="checkout.session.completed"){

        const session=event.data.object;

        console.log("SESSION:");
        console.log(session);

        console.log("metadata:");
        console.log(session.metadata);

        console.log("payment id:");
        console.log(session.metadata.paymentId);

        const updated=await Payment.findByIdAndUpdate(
            session.metadata.paymentId,
            {
                paymentStatus:"completed"
            },
            {new:true}
        );

        console.log(updated);

    }
    res.json({
        received:true
    });
}

export const getAllPayments=async(req,res)=>{
    try {
        const loggedInUser=req.user.id;

        const payments=await Payment.find({
            $or:[
                {investorId: loggedInUser},
                {entrepreneurId:loggedInUser}
            ]
        })
            .populate("entrepreneurId", "username companyName")
            .populate("investorId", "username companyName")
        if(!payments){
            return res.status(404).json({
                error: 'Payment not found.',
            })
        }

        return res.status(200).json({
            status:"success",
            payments:payments
        })
    }catch (err){
        console.log(err.message);
        return res.status(500).json({error: err.message});
    }
}