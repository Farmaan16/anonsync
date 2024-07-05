import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  await dbConnect('AnonSync');

  //Check if username and email already exist in database
  try {
    const body = await request.json();
    const { username, email, password } = body;

    //Find if username already exists in database
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    //If username already exists, return error
    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    //Find if email already exists in database
    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    //If email already exists, generate verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    //If user exists but is not verified, update their password and verification code
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email already taken" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }

      //If user does not exist, create new user
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      //Create new user document
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      //Save user document to database
      await newUser.save();
    }

    //send verification email

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User created successfully. Please verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error signing up", error);
    return Response.json(
      { success: false, message: "Error signing up" },
      { status: 500 }
    );
  }
  
}
