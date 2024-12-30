import { sendVerificationEmail } from "@/helpers/sendVerification";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken",
                status: 400,
            });
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({ email: email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User with this email already exists",
                    status: 400,
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                ); //ms
                existingUserVerifiedByEmail.username = username
                await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = {
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            };

            await UserModel.create(newUser);
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message || "Error sending verification email",
                status: 500,
            });
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            status: 200,
        });
    } catch (error) {
        console.error("Error registering user", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user",
            status: 500,
        });
    }
}
