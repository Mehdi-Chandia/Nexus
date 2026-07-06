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




export async function sendResetPasswordEmail(email, resetLink) {
    try {
        const response = await brevo.transactionalEmails.sendTransacEmail({
            subject: "Your Reset Password link",
            htmlContent: `
                <h2>Reset Your Password</h2>
                <p>Click below link to reset password:</p>
                <a href="${resetLink}">
                Reset Password
                </a>
                <p>This link expires in 10 minutes.</p>
            `,
            sender: { name: "Nexus", email: process.env.EMAIL },
            to: [{ email }],
        });

        console.log("Reset password email sent:", response);
        return response;

    } catch (err) {
        console.log("Brevo send error:", err?.rawResponse?.body || err);
        return null;
    }
}