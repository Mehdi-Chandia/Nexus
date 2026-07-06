import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

export async function sendOTPEmail(email, otp) {
    try {
        const response = await brevo.transactionalEmails.sendTransacEmail({
            subject: "Your Verification Code",
            htmlContent: `
                <h2>Your OTP Code</h2>
                <p>Your verification code is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 5 minutes.</p>
            `,
            sender: { name: "Nexus", email: process.env.EMAIL },
            to: [{ email }],
        });

        console.log("OTP email sent:", response);
        return response;

    } catch (err) {
        console.log("Brevo send error:", err?.rawResponse?.body || err);
        return null;
    }
}
// const resend = new Resend(
//     process.env.RESEND_API_KEY
// );
//
// export async function sendOTPEmail(email, otp){
//
//     try{
//
//         const response = await resend.emails.send({
//
//             from: "onboarding@resend.dev",
//
//             to: email,
//
//             subject: "Your Verification Code",
//
//             html: `
//             <h2>Your OTP Code</h2>
//
//             <p>Your verification code is:</p>
//
//             <h1>${otp}</h1>
//
//             <p>This code expires in 5 minutes.</p>
//          `
//         });
//
//         return response;
//
//     }catch(err){
//
//         console.log(err);
//
//         return null;
//     }
// }

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