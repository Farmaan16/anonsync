import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";




/**
 * GET route for getting all messages of a user
 * 
 * This route will get all the messages of a user, sorted by creation date (descending)
 * It will return a json object with a success flag and the list of messages
 */
export async function GET(request: Request) {
    await dbConnect("AnonSync"); // Connect to database


    const session = await getServerSession(authOptions); // Get NextAuth session
    const user: User = session?.user as User; // Get user from session

    if (!session || !session.user) { // If user is not authenticated
        return Response.json( // Return unauthorized error
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id); // Get the user id from the session
    
    try {
        const user = await UserModel.aggregate([ // Use Mongoose aggregate to get the messages
            {
                $match: { // Filter by user id
                    id: userId
                }
            },
            {
                $unwind: "$messages" // Unwind the messages array
            },
            {
                $sort: { // Sort by creation date
                    "messages.createdAt": -1
                }
            },
            {
                $group: { // Group by user id and push messages to an array
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }                
            }
            
        ]);        

        if (!user || user.length === 0) { // If no user was found
            return Response.json({ success: false, message: "User not found" }, { status: 404 }) // Return not found error
        }

        return Response.json({ success: true, messages: user[0].messages }, { status: 200 }) // Return success with the list of messages
        

    } catch (error) {
        console.log("failed to find messages", error) // Log error

        return Response.json({ success: false, message: "Failed to find messages" }, { status: 500 })
    }
}  

