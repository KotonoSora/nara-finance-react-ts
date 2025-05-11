import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, LockIcon, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { useLandingContext } from "../context/landing-context";

import screenshotApp from "/assets/landing-page/svg/screenshot-app.svg";

const formSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
});

export default function HeroSection() {
  const { name } = useLandingContext();

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
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-y-0 -left-[50%] w-[200%] bg-[radial-gradient(circle_400px_at_50%_300px,var(--primary)/15,transparent)]" />
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

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="/assets/landing-page/svg/Download_on_the_App_Store_Badge_VN_RGB_blk_100217.svg"
                    alt="Tải xuống trên App Store"
                    className="h-10 block object-contain"
                  />
                </motion.a>

                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="/assets/landing-page/png/GetItOnGooglePlay_Badge_Web_color_Vietnamese.png"
                    alt="Tải xuống trên Google Play"
                    className="h-10 block object-contain rounded-[5px]"
                  />
                </motion.a>
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
              <div className="rounded-2xl bg-background shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
                <img
                  src={screenshotApp}
                  alt={`${name} Dashboard`}
                  className="block object-contain shadow-lg w-full h-auto"
                  fetchPriority="high"
                  sizes="(min-width: 768px) 480px, 100vw"
                />
              </div>

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
