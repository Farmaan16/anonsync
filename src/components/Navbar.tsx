"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { User } from "next-auth";
import { Button } from "../components/ui/button";

function Navbar() {
  const { data: session } = useSession();

  const user = session?.user as User;

  return (
    <nav className="p-4 md:p-4   text-zinc-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a
          href="/"
          className="text-5xl font-extrabold mb-4 md:mb-0 text-zinc-800"
        >
          AnonSync
        </a>
        {session ? (
          <>
            <span className="font-semibold text-center md:mr-8">
              Welcome, {user.username || user.email}
            </span>
            <div className="flex justify-center ">
              <Button
                onClick={() => signOut()}
                className="w-full  md:m-6  bg-zinc-900 text-zinc-300 md:text-lg rounded-3xl mx-4"
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center mr-4">
            <Link href="/sign-in">
              <Button
                className="w-full  md:m-6  bg-zinc-900 text-zinc-300 md:text-lg rounded-3xl mx-4  "
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
