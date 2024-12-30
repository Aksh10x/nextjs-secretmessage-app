import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user
        
    if(!(session || user)){
        return NextResponse.json({
            success: false,
            message: "Not authenicated",
            status: 401
        })
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const getUser = await UserModel.aggregate([
            {
                $match: {
                    id: userId
                }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: {'messages.createdAt': -1}
            },
            {
                $project: {
                    id: 1,
                    messages: 1
                }
            }
        ])


        if(!getUser || getUser.length === 0){
            return NextResponse.json({
                success: false,
                message: "No messages",
                status: 400
            })
        }


        return NextResponse.json({
            success: true,
            message: "Messages retrieved",
            data: getUser,
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Could not get messages",
            status: 500
        })
    }

}