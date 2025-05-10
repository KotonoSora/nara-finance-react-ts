import { motion } from "framer-motion";

import { useLandingContext } from "../context/landing-context";
import socialLinks from "../data/social-links";

export default function FooterSection() {
  const { name: appName, domain } = useLandingContext();
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
            <h3 className="text-2xl font-bold">{appName}</h3>
            <p className="text-muted-foreground">
              Kiểm soát tài chính cá nhân, đơn giản hơn bao giờ hết.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ name, href }) => (
                <motion.a
                  key={name}
                  href={href.replace("socialLinks", appName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Theo dõi ${appName} trên ${name}`}
                  title={name}
                >
                  {name}
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
                  href={`mailto:support@${domain}`}
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
            &copy; {new Date().getFullYear()} {appName}. Mọi quyền được bảo lưu.
          </p>
          <p className="mt-2">
            Công ty TNHH {appName} Việt Nam | MST: 0123456789
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
