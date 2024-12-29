import { Message } from "@/model/user.model";
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Message[];
    status: number;
    
}