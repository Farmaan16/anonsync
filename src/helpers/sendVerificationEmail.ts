import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    username: string,
    email: string,
    verifiyCode: string
): Promise<ApiResponse> { 
    try {
        await resend.emails.send({
          from: "AnonSync@resend.dev",
          to: email,
          subject: "AnonSync: Verify your email",
          react: VerificationEmail({ username, otp: verifiyCode }),
        });
        

        return {
            success: true, message: "Verification email sent" }
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return { success: false, message: "Error sending verification email" };
    }
}

