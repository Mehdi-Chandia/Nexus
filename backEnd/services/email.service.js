import { Resend } from "resend";

const resend = new Resend(
    process.env.RESEND_API_KEY
);

export async function sendOTPEmail(email, otp){

    try{

        const response = await resend.emails.send({

            from: "onboarding@resend.dev",

            to: email,

            subject: "Your Verification Code",

            html: `
            <h2>Your OTP Code</h2>

            <p>Your verification code is:</p>

            <h1>${otp}</h1>

            <p>This code expires in 5 minutes.</p>
         `
        });

        return response;

    }catch(err){

        console.log(err);

        return null;
    }
}

export async function sendResetPasswordEmail(email,resetLink){
    try {
        const response=await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Your Reset Password link",
            html:`

            <h2>Reset Your Password</h2>

            <p>Click below link to reset password:</p>

            <a href="${resetLink}">
            Reset Password
            </a>

            <p>This link expires in 10 minutes.</p>

            `
        })
    }catch(err){
        console.log(err);
        return null;
    }
}