import { motion } from "framer-motion";
import { LockIcon } from "lucide-react";

import trustedBy from "../data/trusted-by";
import useCounter from "../hooks/useCounter";

export default function TrustSection() {
  const userCount = useCounter({ end: 5000, suffix: "+" });
  const rating = useCounter({
    end: 4.9,
    start: 4.0,
    duration: 1500,
    delay: 200,
  });

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
