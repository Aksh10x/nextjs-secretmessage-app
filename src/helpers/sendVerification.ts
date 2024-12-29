import { resend } from "@/lib/resend" 
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export const sendVerificationEmail = async(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification code for akshaths app',
            react: VerificationEmail({ username , otp: verifyCode }),
          });
        return {success: true, message: "Verification email send successfully", status: 200}
    } catch (emailError) {
        console.log("Error sending verification email;", emailError)
        return {success: false, message: "Failed to send verification email", status:500}
    }
}
