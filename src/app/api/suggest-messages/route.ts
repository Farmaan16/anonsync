import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

//create an Gemini client (thats edge friendly)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// console.log(process.env.GEMINI_API_KEY);

//set the runtime to edge for faster responses
export const runtime = "edge";

const prompt =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

export async function POST(req: Request) {
  try {
    //Ask gemini for a streaming chat completion response with the prompt
    const geminiStream = await genAI
      .getGenerativeModel({ model: "gemini-pro" })
      .generateContentStream(prompt);

    //Convert the response stream into a text response
    const stream = GoogleGenerativeAIStream(geminiStream);

    //Return the text response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    throw error;
  }
}
