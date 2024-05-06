import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

 


export async function POST(request: Request) {
    await dbConnect("AnonSync"); 
    

    try {
        const { username, code } = await request.json();
        
       const usernameDecoded = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: usernameDecoded });
        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: "Account verified successfully" }, { status: 200 });
        } else if (!isCodeValid) {
            return Response.json({ success: false, message: "Invalid code" }, { status: 400 });
        } else if (!isCodeNotExpired) {
            return Response.json({ success: false, message: "Verification code expired, please sign up again " }, { status: 400 });
        }

    } catch (error) {
        console.error("Error verifying code", error)
        return Response.json({ success: false, message: "Error verifying code" }, { status: 500 })
    }
    
}