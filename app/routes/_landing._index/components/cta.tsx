import { motion } from "framer-motion";

import { Button } from "~/components/ui/button";

export default function CTASection() {
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
