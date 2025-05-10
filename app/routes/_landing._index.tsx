import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  FacebookIcon,
  Linkedin,
  LockIcon,
  Moon,
  PieChart,
  SaveIcon,
  Sun,
  TrendingUp,
  TwitterIcon,
} from "lucide-react";
import { Fragment, lazy, Suspense, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Route } from "./+types/_landing._index";

import { ModeSwitcher } from "~/components/mode-switcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Input } from "~/components/ui/input";

import screenshotApp from "/assets/screenshot-app.svg";

interface TooltipTermProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

function TooltipTerm({ term, definition, children }: TooltipTermProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="border-b border-dotted border-muted-foreground/50 cursor-help">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm" align="start">
        <div className="space-y-2">
          <h4 className="font-semibold">{term}</h4>
          <p className="text-muted-foreground">{definition}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// Counter Hook
type EasingFunction = (t: number) => number;

const easings = {
  linear: (t: number) => t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeOutCubic: (t: number) => 1 + --t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
};

interface UseCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  easing?: keyof typeof easings | EasingFunction;
  formatter?: (value: number) => string;
  autoStart?: boolean;
}

function useCounter({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  easing = "easeOutCubic",
  formatter = (value: number) => {
    const fixed = Number(value).toFixed(decimals);
    return Intl.NumberFormat("vi-VN").format(Number(fixed));
  },
  autoStart = true,
}: UseCounterProps) {
  const [count, setCount] = useState(start);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const countRef = useRef(start);
  const [isInView, setIsInView] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const easingFn = typeof easing === "function" ? easing : easings[easing];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("stats-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView || !isPlaying) return;

    const startTime = Date.now();
    const timer = setTimeout(() => {
      const animate = () => {
        const now = Date.now();
        const elapsedTime = now - startTime;
        const rawProgress = Math.min(elapsedTime / duration, 1);
        const progress = easingFn(rawProgress);

        const diff = end - start;
        const currentValue = start + diff * progress;
        const currentCount =
          decimals > 0
            ? Number(currentValue.toFixed(decimals))
            : Math.floor(currentValue);

        if (countRef.current !== currentCount) {
          countRef.current = currentCount;
          setCount(currentCount);
        }

        if (rawProgress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, start, duration, delay, isInView, isPlaying, decimals, easingFn]);

  const pause = () => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const resume = () => {
    setIsPlaying(true);
  };

  const reset = () => {
    setCount(start);
    countRef.current = start;
    if (autoStart) {
      resume();
    } else {
      pause();
    }
  };

  return {
    value: `${prefix}${formatter(count)}${suffix}`,
    rawValue: count,
    progress: (count - start) / (end - start),
    isFinished: count === end,
    isPlaying,
    controls: {
      pause,
      resume,
      reset,
    },
  };
}

const faqs = [
  {
    question: "MoneyFlow có miễn phí không?",
    answer: "Có bản dùng thử miễn phí, không cần thẻ tín dụng!",
  },
  {
    question: "Tôi có cần biết tài chính không?",
    answer: "Không, MoneyFlow được thiết kế đơn giản cho mọi người.",
  },
  {
    question: "Dữ liệu của tôi có an toàn không?",
    answer: "Chúng tôi sử dụng mã hóa cấp ngân hàng để bảo vệ dữ liệu.",
  },
  {
    question: "Mất bao lâu để bắt đầu?",
    answer: "Chỉ 5 phút để thiết lập và bắt đầu quản lý tài chính!",
  },
];

export function meta({}: Route.MetaArgs) {
  const title = "MoneyFlow - Quản lý tài chính cá nhân thông minh với AI";
  const description =
    "Quản lý dòng tiền dễ dàng với công cụ AI: theo dõi giao dịch tự động, lập ngân sách thông minh, tối ưu tiết kiệm 20%, và quyết toán thuế chính xác. Dùng thử miễn phí ngay hôm nay!";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return [
    { title },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "tài chính cá nhân, quản lý dòng tiền, lập ngân sách, tiết kiệm, AI tài chính, quản lý chi tiêu",
    },
    // Open Graph tags
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    {
      property: "og:image",
      content: "https://moneyflow.app/assets/og-image.jpg",
    },
    { property: "og:url", content: "https://moneyflow.app" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://moneyflow.app/assets/twitter-card.jpg",
    },
    // Schema.org JSON-LD
    {
      tagName: "script",
      type: "application/ld+json",
      children: JSON.stringify(jsonLd),
    },
  ];
}

export default function LandingPage({ loaderData }: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense
        fallback={
          <div className="flex justify-center py-16 text-muted-foreground">
            Đang tải...
          </div>
        }
      >
        <Header />
        <HeroSection />
        <BenefitsSection />
        <SocialProofSection />
        <TrustSection />
        <CTASection />
        <FAQSection />
        <FooterSection />
      </Suspense>
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex px-4 sm:px-6 lg:px-8 h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">MoneyFlow</h1>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Kiểm soát tài chính, đơn giản hơn
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ModeSwitcher />
            <Button asChild size="sm" className="h-8">
              <a href="#email-form">Dùng thử miễn phí</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

const formSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
});

function HeroSection() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Email submitted:", data.email);
    form.reset();
  };

  return (
    <section className="relative overflow-hidden bg-muted py-8 sm:py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-y-0 -left-[50%] w-[200%] bg-[radial-gradient(circle_400px_at_50%_300px,#22c55e15,transparent)]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            className="flex-1 space-y-6 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Powered by AI
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                Quản lý dòng tiền dễ dàng trong{" "}
                <span className="text-primary relative">
                  5 phút
                  <span className="absolute bottom-0 left-0 w-full h-[4px] bg-primary/20"></span>
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-[700px] mx-auto md:mx-0">
              Công cụ AI giúp bạn theo dõi giao dịch, lập ngân sách, tiết kiệm,
              và quyết toán thuế một cách thông minh và hiệu quả.
            </p>

            <div className="space-y-4">
              <Form {...form}>
                <form
                  id="email-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto md:mx-0"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input
                            placeholder="Nhập email để bắt đầu dùng thử"
                            className="h-11 bg-background/60 backdrop-blur border-input"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="h-11 px-8 font-medium"
                  >
                    Bắt đầu ngay <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <LockIcon className="w-4 h-4" />
                  <span>Bảo mật SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Miễn phí 14 ngày</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 w-full md:w-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-[480px]">
              {/* Mock Device Frame */}
              <div className="rounded-2xl bg-background shadow-2xl ring-1 ring-gray-900/10">
                <img
                  src={screenshotApp}
                  alt="MoneyFlow Dashboard"
                  width={480}
                  height={300}
                  className="rounded-lg shadow-lg w-full h-auto"
                  fetchPriority="high"
                  sizes="(min-width: 768px) 480px, 100vw"
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -right-6 -top-6 p-4 bg-background rounded-lg shadow-lg border border-border hidden sm:block"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Tiết kiệm</div>
                    <div className="text-2xl font-bold text-primary">+20%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -left-6 -bottom-6 p-4 bg-background rounded-lg shadow-lg border border-border hidden sm:block"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-sm font-medium mb-1">AI Phân tích</div>
                <div className="flex gap-1">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i} className="text-primary">
                      {star}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const benefits = [
  {
    Icon: BarChart3,
    title: "Lưu trữ giao dịch tự động",
    description:
      "AI tự động phân loại và ghi lại mọi giao dịch trong thời gian thực, giúp bạn không bỏ sót bất kỳ khoản chi nào.",
    stats: "Tiết kiệm 2 giờ/tuần",
    terms: [
      {
        term: "Phân loại giao dịch tự động",
        definition:
          "Sử dụng AI để tự động nhận diện và phân loại các giao dịch vào các danh mục phù hợp như ăn uống, di chuyển, mua sắm, v.v.",
      },
    ],
  },
  {
    Icon: Calendar,
    title: "Lập ngân sách cá nhân hóa",
    description:
      "Tạo kế hoạch chi tiêu linh hoạt chỉ với 3 bước đơn giản, tự động điều chỉnh theo thói quen của bạn.",
    stats: "3 bước đơn giản",
    terms: [
      {
        term: "Ngân sách cá nhân hóa",
        definition:
          "Kế hoạch tài chính được điều chỉnh dựa trên thói quen chi tiêu và mục tiêu cá nhân của bạn.",
      },
    ],
  },
  {
    Icon: SaveIcon,
    title: "Tối ưu tiết kiệm",
    description:
      "Tiết kiệm đến 20% mỗi tháng nhờ AI phân tích chi tiêu và đề xuất cắt giảm hợp lý.",
    stats: "Tiết kiệm 20%/tháng",
    terms: [
      {
        term: "AI phân tích chi tiêu",
        definition:
          "Công nghệ trí tuệ nhân tạo phân tích mô hình chi tiêu để tìm ra các khoản chi không cần thiết và đề xuất cách tiết kiệm.",
      },
    ],
  },
  {
    Icon: PieChart,
    title: "Quyết toán thuế dễ dàng",
    description:
      "Tự động phân loại thu nhập và chi phí, xuất báo cáo thuế chính xác chỉ với 1 cú nhấp.",
    stats: "Chính xác 99.9%",
    terms: [
      {
        term: "Quyết toán thuế",
        definition:
          "Quá trình tổng hợp và báo cáo thu nhập, chi phí trong năm để tính toán số thuế phải nộp hoặc được hoàn trả.",
      },
    ],
  },
];

function BenefitsSection() {
  return (
    <section className="bg-muted py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tại sao chọn MoneyFlow?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="bg-background border-border transition-all duration-300 hover:shadow-lg hover:border-primary/50 h-full">
                <CardHeader>
                  <div className="mb-4 relative">
                    <div
                      className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      aria-hidden="true"
                    >
                      <benefit.Icon className="w-6 h-6 text-primary" />
                    </div>
                    <motion.div
                      className="absolute -right-2 -top-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        delay: 0.2 + index * 0.1,
                      }}
                    >
                      {benefit.stats}
                    </motion.div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description.split(" ").map((word, i) => {
                      const term = benefit.terms.find((t) =>
                        word
                          .toLowerCase()
                          .includes(t.term.toLowerCase().split(" ")[0]),
                      );
                      return term ? (
                        <Fragment key={i}>
                          {i > 0 ? " " : ""}
                          <TooltipTerm
                            term={term.term}
                            definition={term.definition}
                          >
                            {word}
                          </TooltipTerm>
                        </Fragment>
                      ) : (
                        <Fragment key={i}>
                          {i > 0 ? " " : ""}
                          {word}
                        </Fragment>
                      );
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote:
      "MoneyFlow giúp tôi tiết kiệm được 20% thu nhập mỗi tháng. AI phân tích chi tiêu giúp tôi nhận ra nhiều khoản phí không cần thiết!",
    author: "Minh Trần",
    position: "Digital Marketing Freelancer",
    location: "TP. Hồ Chí Minh",
    avatar: "/assets/avatars/avatar-1.jpg",
  },
  {
    quote:
      "Tôi đã thử nhiều app quản lý chi tiêu nhưng MoneyFlow là app đầu tiên tôi dùng được liên tục 6 tháng. Giao diện đơn giản, dễ dùng!",
    author: "Lan Nguyễn",
    position: "Kế toán trưởng",
    location: "Hà Nội",
    avatar: "/assets/avatars/avatar-2.jpg",
  },
  {
    quote:
      "Tính năng phân tích và dự báo dòng tiền giúp tôi lên kế hoạch tài chính chính xác hơn. Đặc biệt hữu ích cho việc lập kế hoạch kinh doanh.",
    author: "Hùng Phạm",
    position: "Chủ doanh nghiệp SME",
    location: "Đà Nẵng",
    avatar: "/assets/avatars/avatar-3.jpg",
  },
];

function SocialProofSection() {
  return (
    <section className="bg-muted py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Người dùng nói gì về MoneyFlow
        </motion.h2>

        <div className="max-w-5xl mx-auto">
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
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-background border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                            sizes="48px"
                          />
                          <div>
                            <p className="font-semibold text-foreground">
                              {testimonial.author}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.position}
                            </p>
                            <p className="text-sm text-muted-foreground">
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
                        <p className="text-muted-foreground italic leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="top-[45%] -left-12" />
              <CarouselNext className="top-[45%] -right-12" />
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
            <span className="text-sm font-medium">
              5,000+ người dùng hài lòng
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustSection() {
  const userCount = useCounter({ end: 5000, suffix: "+" });
  const rating = useCounter({
    end: 4.9,
    start: 4.0,
    duration: 1500,
    delay: 200,
  });

  const trustedBy = [
    { name: "TechInAsia", logo: "/assets/logos/techinasia.svg" },
    { name: "ProductHunt", logo: "/assets/logos/producthunt.svg" },
    { name: "App Store", logo: "/assets/logos/appstore.svg" },
    { name: "Google Play", logo: "/assets/logos/googleplay.svg" },
  ];

  const stats = [
    { label: "Người dùng hài lòng", value: userCount.value },
    { label: "Đánh giá trung bình", value: `${rating.value}/5` },
    { label: "Bảo mật", value: "SSL", icon: LockIcon },
  ];

  return (
    <section
      id="stats-section"
      className="bg-background py-8 sm:py-12 lg:py-16 border-y border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-base sm:text-lg text-muted-foreground mb-4">
            Được tin tưởng bởi
          </h3>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12">
            {trustedBy.map((brand) => (
              <motion.div
                key={brand.name}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={brand.logo}
                  alt={`Logo của ${brand.name}`}
                  className="h-6 sm:h-8 lg:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
                  width={120}
                  height={40}
                  loading="lazy"
                  sizes="(min-width: 1024px) 120px, (min-width: 640px) 96px, 72px"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {stat.icon && <stat.icon className="w-4 h-4 text-primary" />}
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-primary py-12 sm:py-16 lg:py-24 text-primary-foreground text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sẵn sàng quản lý tài chính hiệu quả hơn?
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tham gia MoneyFlow để dùng thử miễn phí và kiểm soát dòng tiền của bạn
          ngay hôm nay!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-background text-primary hover:bg-accent/90"
          >
            <a href="#email-form">Dùng thử miễn phí</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="bg-muted py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Câu hỏi thường gặp
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full bg-background rounded-lg shadow-sm"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-foreground text-left px-4 hover:bg-muted transition-colors">
                    <span className="flex items-center gap-2">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground px-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

function FooterSection() {
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/moneyflowapp",
      Icon: FacebookIcon,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/moneyflowapp",
      Icon: Linkedin,
    },
    {
      name: "Twitter",
      href: "https://x.com/moneyflowapp",
      Icon: TwitterIcon,
    },
  ];

  return (
    <footer
      role="contentinfo"
      className="bg-muted text-foreground py-8 sm:py-12 lg:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold">MoneyFlow</h3>
            <p className="text-muted-foreground">
              Kiểm soát tài chính cá nhân, đơn giản hơn bao giờ hết.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ name, href, Icon }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Theo dõi MoneyFlow trên ${name}`}
                  title={name}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.nav
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="Sản phẩm"
          >
            <h4 className="font-semibold">Sản phẩm</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/features"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Tính năng
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Bảng giá
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Hướng dẫn sử dụng
                </a>
              </li>
            </ul>
          </motion.nav>

          <motion.nav
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            aria-label="Công ty"
          >
            <h4 className="font-semibold">Công ty</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </motion.nav>

          <motion.nav
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            aria-label="Hỗ trợ"
          >
            <h4 className="font-semibold">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Chính sách cookie
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@moneyflow.app"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
                >
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </motion.nav>
        </div>

        <motion.div
          className="pt-8 mt-8 border-t border-border text-center text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>
            &copy; {new Date().getFullYear()} MoneyFlow. Mọi quyền được bảo lưu.
          </p>
          <p className="mt-2">
            Công ty TNHH MoneyFlow Việt Nam | MST: 0123456789
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
