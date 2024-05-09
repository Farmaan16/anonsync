import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";




export async function POST(request: Request) {
    await dbConnect("AnonSync");

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) { 
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id
    const { acceptMessages } = await request.json();
    

    try {

       const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            {new: true}

        )

        if (!updatedUser) {
            return Response.json({ success: false, message: "Failed to update user status to accepting messages" }, { status: 401 })
        } else {
            return Response.json({ success: true, message: "Accept messages status updated" }, { status: 200 })
        }
        
    } catch (error) {
        console.log("failed to update user status to accepting messages", error)
        return Response.json({ success: false, message: "Failed to update user status to accepting messages" }, { status: 500 })
    }


}

/**
 * GET route for getting the user's accept messages status
 * 
 * This route will return a json object with a success flag and the user's accept messages status
 */
export async function GET(request: Request) { 
    // Connect to database
    await dbConnect("AnonSync")

    // Get the user's session
    const session = await getServerSession(authOptions);
    // Get the user from the session
    const user: User = session?.user as User;

    // If user is not authenticated, return unauthorized error
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    // Get the user's id from the session
    const userId = user._id;

    try {
        // Find the user in the database
        const userFound = await UserModel.findById(userId);

        // If user is not found, return not found error
        if (!userFound) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 })
        // If user is found, return their accept messages status
        } else {
            return Response.json({ success: true, isAcceptingMessages: userFound.isAcceptingMessages , message: "User found", user: userFound }, { status: 200 })
        }

    } catch (error) {
        // Log the error if something went wrong
        console.log("failed to find user", error)
        // Return internal server error
        return Response.json({ success: false, message: "Failed to find user" }, { status: 500 })
        
    }

    
}
