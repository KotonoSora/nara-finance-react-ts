import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

interface TooltipTermProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export default function TooltipTerm({
  term,
  definition,
  children,
}: TooltipTermProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="border-b border-dotted border-muted-foreground/50 cursor-help">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm" align="start">
        <div className="space-y-2">
          <h4 className="font-semibold">{term}</h4>
          <p className="text-muted-foreground">{definition}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
