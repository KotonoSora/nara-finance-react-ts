import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  FacebookIcon,
  Linkedin,
  LockIcon,
  Moon,
  PieChart,
  SaveIcon,
  Sun,
  TwitterIcon,
} from "lucide-react";
import { lazy, Suspense } from "react";
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
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import screenshotApp from "/assets/screenshot-app.svg";

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

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
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
    <section className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          className="md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
            Quản lý dòng tiền dễ dàng trong 5 phút
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-[700px]">
            Công cụ AI giúp bạn theo dõi giao dịch, lập ngân sách, tiết kiệm, và
            quyết toán thuế.
          </p>
          <Form {...form}>
            <form
              id="email-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="Nhập email để bắt đầu dùng thử"
                        className="w-full bg-background border-input h-11"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="default"
                className="h-11 px-8 whitespace-nowrap"
              >
                Bắt đầu ngay <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LockIcon className="w-4 h-4" />
            <p>
              Chúng tôi không gửi spam. Email của bạn được bảo mật tuyệt đối.
            </p>
          </div>
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
    Icon: BarChart3,
    title: "Lưu trữ giao dịch tự động",
    description:
      "AI tự động phân loại và ghi lại mọi giao dịch trong thời gian thực, giúp bạn không bỏ sót bất kỳ khoản chi nào.",
  },
  {
    Icon: Calendar,
    title: "Lập ngân sách cá nhân hóa",
    description:
      "Tạo kế hoạch chi tiêu linh hoạt chỉ với 3 bước đơn giản, tự động điều chỉnh theo thói quen của bạn.",
  },
  {
    Icon: SaveIcon,
    title: "Tối ưu tiết kiệm",
    description:
      "Tiết kiệm đến 20% mỗi tháng nhờ AI phân tích chi tiêu và đề xuất cắt giảm hợp lý.",
  },
  {
    Icon: PieChart,
    title: "Quyết toán thuế dễ dàng",
    description:
      "Tự động phân loại thu nhập và chi phí, xuất báo cáo thuế chính xác chỉ với 1 cú nhấp.",
  },
];

export function BenefitsSection() {
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
            >
              <Card className="bg-background border-border hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mb-4">
                    <benefit.Icon className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
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

export function SocialProofSection() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-background border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
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
                  <p className="text-muted-foreground italic leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="text-center text-muted-foreground mt-8 text-lg"
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

export function TrustSection() {
  const trustedBy = [
    { name: "TechInAsia", logo: "/assets/logos/techinasia.svg" },
    { name: "ProductHunt", logo: "/assets/logos/producthunt.svg" },
    { name: "App Store", logo: "/assets/logos/appstore.svg" },
    { name: "Google Play", logo: "/assets/logos/googleplay.svg" },
  ];

  return (
    <section className="bg-background py-8 sm:py-12 lg:py-16 border-y border-border">
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
              <img
                key={brand.name}
                src={brand.logo}
                alt={brand.name}
                className="h-6 sm:h-8 lg:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </motion.div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <LockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Bảo mật SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center"
            >
              {"★★★★★".split("").map((star, i) => (
                <span key={i} className="text-primary text-sm sm:text-base">
                  {star}
                </span>
              ))}
            </motion.div>
            <span className="text-sm text-muted-foreground">
              4.9/5 từ 5000+ người dùng
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
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

export function FooterSection() {
  return (
    <footer className="bg-muted text-foreground py-8 sm:py-12 lg:py-16">
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
              <a
                href="https://facebook.com/moneyflowapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/moneyflowapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/moneyflowapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold">Sản phẩm</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tính năng
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bảng giá
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hướng dẫn sử dụng
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold">Công ty</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Chính sách cookie
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@moneyflow.app"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </motion.div>
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
