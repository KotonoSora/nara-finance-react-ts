import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

import { useLandingContext } from "../context/landing-context";
import testimonials from "../data/testimonials";

export default function SocialProofSection() {
  const { name } = useLandingContext();

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground/90 text-lg max-w-2xl mx-auto">
            Real feedback from our users
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={testimonial.author}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full p-1"
                  >
                    <Card className="h-full bg-card border-border/40 hover:border-primary/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar>
                            {testimonial.avatar && (
                              <AvatarImage
                                src={testimonial.avatar}
                                alt={testimonial.author}
                              />
                            )}
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {testimonial.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">
                                {testimonial.author}
                              </p>
                              <BadgeCheck className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground/90">
                              {testimonial.position}
                            </p>
                            <p className="text-sm text-muted-foreground/90">
                              {testimonial.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                          {"★★★★★".split("").map((star, i) => (
                            <span key={i} className="text-primary">
                              {star}
                            </span>
                          ))}
                        </div>
                        <p className="text-foreground/90 italic leading-relaxed">
                          "{testimonial.quote.replace("{{APP_NAME}}", name)}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="absolute top-[45%] -left-12" />
              <CarouselNext className="absolute top-[45%] -right-12" />
            </div>
          </Carousel>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-sm font-medium">5,000+ satisfied users</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
