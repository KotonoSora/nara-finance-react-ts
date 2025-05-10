import { motion } from "framer-motion";
import { Fragment } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import benefits from "../data/benefits";
import TooltipTerm from "./tooltip-term";

export default function BenefitsSection() {
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
