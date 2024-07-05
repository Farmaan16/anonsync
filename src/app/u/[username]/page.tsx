'use client'

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { useState } from "react";


const specialChar = '||'

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar)
}

const initialMessageString = "What's your favorite show?|| Do you have any pets?|| What's your favorite book?||"


export default function UserPage() {
  
  const [isLoading, setIsLoading] = useState(false)
  


  const params = useParams<{ username: string }>();
  const username = params.username
  
  
  const { completion, complete, isLoading: isSuggestLoading, error } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString
  })
  
  // console.log(completion)

  // console.log(parseStringMessages(completion))

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })
  
  const messageContent = form.watch('content')
  
  const handleMessageClick =(message : string) => {
    form.setValue('content', message)
  }
  
  
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', { ...data, username })
      
      toast({
        title: response.data.message,
        variant: 'default'
      })
      form.reset({...form.getValues(), content: ''})
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }


  const fetchSuggestedMessages = async () => {
    try {
      complete('')

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch suggested messages',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="container mx-auto my-8 p-4 lg:p-6 bg-white rounded max-w-4xl">
      <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 lg:mb-6 text-center text-stone-700">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-900 font-semibold">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button
                disabled
                className="bg-zinc-800 text-zinc-300 rounded-3xl hover:bg-zinc-900 w-[] lg:w-auto"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="bg-zinc-800 text-zinc-300 rounded-3xl hover:bg-zinc-900 w-[100px] lg:w-auto"
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-6 lg:my-8">
        <div className="space-y-2">
          <div className="flex flex-col items-center  lg:justify-start">
            <Button
              onClick={fetchSuggestedMessages}
              className="my-2 lg:my-4 rounded-3xl  lg:mr-2 lg:w-auto text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium text-sm px-5 py-2.5 text-center me-2 mb-2"
              disabled={isSuggestLoading}
            >
              Get Suggestions From AI 🤖
            </Button>

            <p className="text-gray-600 font-semibold text-center lg:text-left lg:mt-2">
              Click on any message below to select it.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-slate-900">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 w-full lg:w-auto whitespace-normal"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-2 lg:mb-4 font-semibold text">
          Get Your Message Board
        </div>
        <Link href={"/sign-up"}>
          <Button className="bg-blue-900 text-zinc-200 font-bold rounded-3xl hover:bg-blue-700 lg:w-auto">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );


}



