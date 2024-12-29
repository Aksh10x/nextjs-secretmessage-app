import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection: ConnectionObject = {}


async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database")
    }
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL || "")
        connection.isConnected = connectionInstance.connections[0].readyState

        console.log("DB connected successfully")
    } catch (error) {
        console.log("DB connection failed, error:", error)
        process.exit(1)
    }
}

export default dbConnect;