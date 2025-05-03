import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function TaxFAQSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />

        <Accordion type="single" collapsible className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="hover:no-underline">
                <Skeleton className="h-4 w-64" />
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-4/6" />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}
