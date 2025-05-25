import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { getTranslation } from "../utils/translations";

interface TaxFAQProps {
  country: string;
  language: "en" | "vi" | "ja";
}

export function TaxFAQ({ country, language }: TaxFAQProps) {
  const faqItems = [
    {
      question: getTranslation("FAQ.StandardDeduction.Question", language),
      answer: getTranslation(`FAQ.StandardDeduction.${country}`, language),
    },
    {
      question: getTranslation("FAQ.DependentQualification.Question", language),
      answer: getTranslation(`FAQ.DependentQualification.${country}`, language),
    },
    {
      question: getTranslation("FAQ.TaxCredits.Question", language),
      answer: getTranslation(`FAQ.TaxCredits.${country}`, language),
    },
    {
      question: getTranslation("FAQ.ItemizedDeductions.Question", language),
      answer: getTranslation("FAQ.ItemizedDeductions.Answer", language),
    },
    {
      question: getTranslation("FAQ.NonResidentRules.Question", language),
      answer: getTranslation("FAQ.NonResidentRules.Answer", language),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTranslation("FAQ.Title", language)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
