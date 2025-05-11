import { motion } from "framer-motion";

import { Button } from "~/components/ui/button";

import { useLandingContext } from "../context/landing-context";

export default function CTASection() {
  const { name } = useLandingContext();
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
          className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-primary-foreground/90"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tham gia {name} để dùng thử miễn phí và kiểm soát dòng tiền của bạn
          ngay hôm nay!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            variant="ghost"
            className="border-2 border-primary-foreground/20 hover:border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10"
          >
            Bắt đầu dùng thử miễn phí
          </Button>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
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
        </motion.div>
      </div>
    </section>
  );
}
