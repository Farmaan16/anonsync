"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignInForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // Zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Watch form fields
  const identifier = form.watch("identifier");
  const password = form.watch("password");

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "Incorrect email or password",
        variant: "destructive",
      });
      setIsSubmitting(false);
    } else if (result?.url) {
      router.replace("/dashboard");
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Link href="/">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-stone-800">
              AnonSync
            </h1>
          </Link>
          <p className="text-gray-600 mb-4 font-semibold">
            Sign In to get synced anonymously
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-900 font-semibold">
                    Email/Username
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-900 font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting || !identifier || !password}
                className="bg-zinc-900 text-zinc-300 rounded-3xl"
                variant={"outline"}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    Wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center m-4">
          <p className="font-semibold">
            Don&apos;t have an account?
            <Link
              href="/sign-up"
              className="text-blue-600 ml-2 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
