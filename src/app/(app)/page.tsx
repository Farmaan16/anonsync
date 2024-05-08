'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay";


const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-stone-700 ">
            Say it all, without saying who you are.
          </h1>

          <p className="text-lg md:text-2xl mt-4 text-zinc-600">
            Dive into AnonSync - Where Mystery Meets Messaging! Your identity
            stays incognito while your conversations ignite!
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader className="font-bold text-cyan-600">{message.title}</CardHeader>
                    <CardContent className="flex aspect-auto items-center justify-center p-6">
                      <div>
                        <span className="text-xl font-semibold text-slate-800">
                          {message.content}
                        </span>

                        <div className="mt-6">
                          <p className="text-sm font-semibold text-gray-500">
                            {message.received}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-2 md:p-3  text-black font-semibold text-sm">
        © 2024 AnonSync. All rights reserved.
      </footer>
    </>
  );
};

export default Home;


