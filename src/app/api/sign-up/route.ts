import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



export async function POST(request: Request) { 

    await dbConnect();


    try {

        const body = await request.json();
        const { username, email, password } = body;
        
    } catch (error) {
        console.log("Error signing up", error);
        return Response.json({ success: false, message: "Error signing up" } ,{ status: 500 });

    }
}