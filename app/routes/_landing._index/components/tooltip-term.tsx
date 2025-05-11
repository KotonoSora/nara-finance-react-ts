import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="border-b border-dotted border-primary/30 hover:border-primary cursor-help">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={4}
          className="max-w-sm bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/85 shadow-xl"
        >
          <div className="space-y-2 p-1">
            <p className="font-medium text-sm text-foreground">{term}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {definition}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
