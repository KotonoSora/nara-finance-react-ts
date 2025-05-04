import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Route } from "./+types/_landing._index";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import screenshotApp from "/assets/screenshot-app.svg";

// Lazy-load components để cải thiện hiệu suất
// const Header = lazy(() => import("./components/Header"));
// const HeroSection = lazy(() => import("./components/HeroSection"));
// const BenefitsSection = lazy(() => import("./components/BenefitsSection"));
// const SocialProofSection = lazy(
//   () => import("./components/SocialProofSection"),
// );
// const CTASection = lazy(() => import("./components/CTASection"));
// const FAQSection = lazy(() => import("./components/FAQSection"));
// const FooterSection = lazy(() => import("./components/FooterSection"));

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MoneyFlow - Quản lý tài chính cá nhân" },
    {
      name: "description",
      content:
        "Quản lý dòng tiền dễ dàng với công cụ AI: theo dõi giao dịch, lập ngân sách, tiết kiệm, và quyết toán thuế.",
    },
    {
      name: "keywords",
      content: "tài chính cá nhân, quản lý dòng tiền, lập ngân sách, tiết kiệm",
    },
  ];
}

export default function LandingPage({ loaderData }: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-zinc-50">
      <Suspense
        fallback={
          <div className="flex justify-center py-16 text-zinc-600">
            Đang tải...
          </div>
        }
      >
        <Header />
        <HeroSection />
        <BenefitsSection />
        <SocialProofSection />
        <CTASection />
        <FAQSection />
        <FooterSection />
      </Suspense>
    </main>
  );
}

export function Header() {
  return (
    <header className="bg-zinc-50 border-b border-zinc-200 py-4 px-4 md:px-8 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">MoneyFlow</h1>
        <p className="text-sm text-zinc-600 hidden md:block">
          Kiểm soát tài chính, đơn giản hơn
        </p>
      </div>
      <Button
        asChild
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
      >
        <a href="#email-form">Dùng thử miễn phí</a>
      </Button>
    </header>
  );
}

const formSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
});

export function HeroSection() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Email submitted:", data.email);
    // TODO: Tích hợp Cloudflare D1 hoặc dịch vụ email
    form.reset();
  };

  return (
    <section className="bg-zinc-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          className="md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 leading-tight">
            Quản lý dòng tiền dễ dàng trong 5 phút
          </h1>
          <p className="text-lg md:text-xl text-zinc-600">
            Công cụ AI giúp bạn theo dõi giao dịch, lập ngân sách, tiết kiệm, và
            quyết toán thuế.
          </p>
          <Form {...form}>
            <form
              id="email-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-4 max-w-md"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nhập email của bạn"
                        className="border-zinc-300 bg-zinc-100 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Dùng thử miễn phí
              </Button>
            </form>
          </Form>
          <p className="text-sm text-zinc-600">Không cần thẻ tín dụng.</p>
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={screenshotApp}
            alt="Ứng dụng tài chính cá nhân"
            loading="lazy"
            className="w-full max-w-md mx-auto rounded-lg shadow-lg hover:scale-102 transition-transform duration-300"
          />
        </motion.div>
      </div>
    </section>
  );
}

const benefits = [
  {
    icon: "📊",
    title: "Lưu trữ giao dịch tự động",
    description: "Ghi lại mọi giao dịch trong thời gian thực, không bỏ sót.",
  },
  {
    icon: "💰",
    title: "Lập ngân sách cá nhân hóa",
    description: "Lập kế hoạch chi tiêu chỉ trong 3 bước đơn giản.",
  },
  {
    icon: "💸",
    title: "Tối ưu tiết kiệm",
    description: "Đề xuất tiết kiệm thông minh dựa trên thu nhập của bạn.",
  },
  {
    icon: "📑",
    title: "Quyết toán thuế dễ dàng",
    description: "Xuất báo cáo thuế nhanh chóng với 1 cú nhấp.",
  },
];

export function BenefitsSection() {
  return (
    <section className="bg-zinc-100 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-zinc-900 text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tại sao chọn MoneyFlow?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white border-zinc-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl font-semibold text-zinc-900">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">{benefit.description}</p>
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
    quote: "MoneyFlow giúp tôi tiết kiệm 20% mỗi tháng!",
    author: "Minh, Freelancer",
  },
  {
    quote: "Theo dõi giao dịch dễ dàng, tiết kiệm thời gian!",
    author: "Lan, Nhân viên văn phòng",
  },
  {
    quote: "Lập ngân sách chưa bao giờ đơn giản đến thế!",
    author: "Hùng, Doanh nhân",
  },
];

export function SocialProofSection() {
  return (
    <section className="bg-zinc-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-zinc-900 text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Người dùng nói gì về MoneyFlow
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white border-zinc-200">
                <CardContent className="pt-6">
                  <p className="text-zinc-600 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-zinc-900 font-semibold">
                    {testimonial.author}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="text-center text-zinc-600 mt-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Hơn 5.000 người dùng đã tin tưởng MoneyFlow!
        </motion.p>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="bg-blue-500 py-16 md:py-24 text-white text-center">
      <div className="container mx-auto px-4 md:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sẵn sàng quản lý tài chính hiệu quả hơn?
        </motion.h2>
        <motion.p
          className="text-lg mb-8 max-w-2xl mx-auto"
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
            className="bg-white text-blue-500 hover:bg-zinc-100 text-lg px-8 py-3 rounded-md"
          >
            <a href="#email-form">Dùng thử miễn phí</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
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

export function FAQSection() {
  return (
    <section className="bg-zinc-100 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-zinc-900 text-center mb-12"
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
        >
          <Accordion
            type="single"
            collapsible
            className="max-w-2xl mx-auto bg-white rounded-lg"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="text-zinc-900 text-left px-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-600 px-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="bg-zinc-900 text-zinc-100 py-12">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-2">MoneyFlow</h3>
          <p className="text-zinc-400">
            Kiểm soát tài chính cá nhân, đơn giản hơn bao giờ hết.
          </p>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            variant="link"
            asChild
            className="text-zinc-100 hover:text-zinc-300"
          >
            <a href="/privacy">Chính sách bảo mật</a>
          </Button>
          <Button
            variant="link"
            asChild
            className="text-zinc-100 hover:text-zinc-300"
          >
            <a href="/terms">Điều khoản sử dụng</a>
          </Button>
          <Button
            variant="link"
            asChild
            className="text-zinc-100 hover:text-zinc-300"
          >
            <a href="mailto:support@moneyflow.app">Liên hệ</a>
          </Button>
          <Button
            variant="link"
            asChild
            className="text-zinc-100 hover:text-zinc-300"
          >
            <a
              href="https://x.com/moneyflowapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Theo dõi trên X
            </a>
          </Button>
        </motion.div>
      </div>
    </footer>
  );
}
