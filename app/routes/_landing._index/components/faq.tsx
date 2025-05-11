import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";

import { useLandingContext } from "../context/landing-context";
import faqs from "../data/faqs";

export default function FAQSection() {
  const { name, domain } = useLandingContext();
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Câu hỏi thường gặp
          </h2>
          <p className="text-muted-foreground/90 text-lg max-w-2xl mx-auto">
            Tìm hiểu thêm về cách chúng tôi có thể giúp bạn
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full bg-card rounded-lg shadow-sm"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={`item-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-foreground text-left px-4 hover:bg-muted/80 transition-colors">
                    <span className="flex items-center gap-2">
                      {faq.question.replace("{{APP_NAME}}", name)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 px-4 leading-relaxed">
                    {faq.answer.replace("{{APP_NAME}}", name)}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-muted-foreground mb-4">
              Vẫn còn câu hỏi? Đội ngũ hỗ trợ chúng tôi luôn sẵn sàng giúp đỡ
              bạn.
            </p>
            <Button variant="outline" asChild className="gap-2">
              <a href={`mailto:support@${domain}`}>
                <MessageCircle className="h-4 w-4" />
                Chat với chúng tôi
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
