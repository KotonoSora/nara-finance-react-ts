import { motion } from "framer-motion";
import { LockIcon, ShieldCheck, VerifiedIcon } from "lucide-react";

import trustedBy from "../data/trusted-by";
import useCounter from "../hooks/use-counter";

export default function TrustSection() {
  const userCount = useCounter({ end: 10000, suffix: "+" });
  const satisfactionRating = useCounter({
    end: 99,
    start: 30,
    duration: 1500,
    delay: 200,
    suffix: "%",
  });

  const stats = [
    {
      label: "Khách hàng tin tưởng",
      value: userCount.value,
      icon: ShieldCheck,
    },
    {
      label: "Giao dịch mỗi ngày",
      value: "1M+",
      icon: LockIcon,
    },
    {
      label: "Độ hài lòng",
      value: satisfactionRating.value,
      icon: VerifiedIcon,
    },
  ];

  return (
    <section
      id="stats-section"
      className="relative py-16 sm:py-20 lg:py-28 bg-muted/50 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 w-full bg-[radial-gradient(circle_800px_at_50%_400px,var(--primary)/5,transparent)]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 md:mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground tracking-tight">
            Được tin tưởng bởi các doanh nghiệp hàng đầu
          </h2>
          <p className="text-lg text-muted-foreground">
            Hàng nghìn doanh nghiệp đã và đang sử dụng nền tảng của chúng tôi để
            quản lý tài chính
          </p>
        </motion.div>

        {/* Stats grid - placed before logos for better visual hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 md:mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="group flex flex-col items-center justify-center p-8 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {stat.icon && (
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-6 h-6" />
                  </div>
                )}
                <span className="text-3xl font-bold text-foreground">
                  {stat.value}
                </span>
              </div>
              <p className="text-base font-medium text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trusted by logos */}
        <div className="relative">
          {/* Gradient fade effects */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/50 to-transparent z-10" />

          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-16 max-w-5xl mx-auto px-8">
            {trustedBy.map(
              (company, index) =>
                company.logo && (
                  <motion.div
                    key={company.name}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="opacity-60 group-hover:opacity-100 transition-all duration-300 grayscale group-hover:grayscale-0 h-8 sm:h-10"
                      loading="lazy"
                      sizes="(min-width: 1024px) 160px, (min-width: 640px) 140px, 120px"
                    />
                  </motion.div>
                ),
            )}
          </div>
        </div>

        {/* Security Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-16 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-full bg-primary/10">
              <VerifiedIcon className="w-4 h-4 text-primary" />
            </div>
            <span>Verified on App Store</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-full bg-primary/10">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="p-1.5 rounded-full bg-primary/10">
              <LockIcon className="w-4 h-4 text-primary" />
            </div>
            <span>DMCA Protected</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
