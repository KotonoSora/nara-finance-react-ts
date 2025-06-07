import { motion } from "framer-motion";
import {
  BadgeInfo,
  CheckCircle,
  Clock,
  Cpu,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

import { useLandingContext } from "../context/landing-context";
import benefits from "../data/benefits";
import TooltipTerm from "./tooltip-term";

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.2 } },
};

export default function BenefitsSection() {
  const { name } = useLandingContext();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 w-full bg-[radial-gradient(circle_800px_at_50%_400px,var(--primary)/5,transparent)]" />
      </div>

      <TooltipProvider>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Choose {name}?
          </motion.h2>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {benefits
              .slice()
              .sort((a, b) => a.priority - b.priority)
              .map((benefit, index) => {
                const Icon = benefit.Icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={cn(
                      benefit.highlight && "lg:col-span-2 xl:col-span-3",
                    )}
                  >
                    <Card
                      className={cn(
                        "relative isolate overflow-hidden h-full",
                        "transition-all duration-300",
                        "border-border/40 hover:border-primary/30",
                        "bg-card/95 hover:bg-card shadow-sm hover:shadow-md",
                        benefit.highlight && [
                          "bg-gradient-to-b from-primary/5 to-transparent",
                          "hover:from-primary/10 hover:to-transparent",
                        ],
                      )}
                    >
                      <CardHeader>
                        <div className="relative flex items-start justify-between mb-4">
                          <motion.div
                            className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                              benefit.highlight
                                ? "bg-primary/20 group-hover:bg-primary/30"
                                : "bg-primary/10 group-hover:bg-primary/20",
                            )}
                            initial="initial"
                            whileHover="hover"
                            variants={iconVariants}
                            aria-hidden="true"
                          >
                            <Icon
                              className={cn(
                                "w-6 h-6 text-primary/80 transition-transform",
                                benefit.highlight && "scale-110",
                              )}
                            />
                          </motion.div>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Độ phức tạp thiết lập"
                              >
                                {benefit.setupComplexity === "simple" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : benefit.setupComplexity === "moderate" ? (
                                  <Clock className="h-4 w-4" />
                                ) : (
                                  <Cpu className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-popover/95 fill-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/85 border-border/50 shadow-lg"
                            >
                              <p className="text-sm font-medium text-foreground">
                                Setup Complexity:{" "}
                                <span className="text-primary capitalize">
                                  {benefit.setupComplexity}
                                </span>
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div>
                          <CardTitle
                            className={cn(
                              "text-xl font-semibold mb-2 transition-colors",
                              benefit.highlight
                                ? "text-primary group-hover:text-primary/90"
                                : "text-foreground group-hover:text-primary/80",
                            )}
                          >
                            {benefit.title}
                          </CardTitle>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs capitalize",
                                  "bg-background/80 hover:bg-accent/20",
                                  "text-foreground/80 hover:text-accent-foreground",
                                  "border-border/50 hover:border-accent/30",
                                )}
                              >
                                {benefit.subCategory}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="capitalize">
                                Category: {benefit.subCategory}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p
                          className={cn(
                            "leading-relaxed",
                            benefit.highlight
                              ? "text-foreground/90"
                              : "text-muted-foreground",
                          )}
                        >
                          {benefit.description.split(" ").map((word, i) => {
                            const term = benefit.terms.find((t) =>
                              word
                                .toLowerCase()
                                .includes(t.term.toLowerCase().split(" ")[0]),
                            );
                            return term ? (
                              <Fragment key={i}>
                                {i > 0 && " "}
                                <TooltipTerm
                                  term={term.term}
                                  definition={term.definition}
                                >
                                  {word}
                                </TooltipTerm>
                              </Fragment>
                            ) : (
                              <Fragment key={i}>
                                {i > 0 && " "}
                                {word}
                              </Fragment>
                            );
                          })}
                        </p>

                        {benefit.stats && benefit.stats?.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {benefit.stats.map((stat, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-1.5"
                              >
                                <span className="font-semibold text-foreground">
                                  {stat.value}
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center">
                                      <span className="text-sm text-muted-foreground">
                                        {stat.label}
                                      </span>
                                      <BadgeInfo className="h-4 w-4 ml-1 text-muted-foreground/50 hover:text-muted-foreground" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    align="start"
                                    className="bg-popover/95 fill-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/85 border-border/50 shadow-lg"
                                  >
                                    <div className="space-y-2 p-1">
                                      {stat.timeframe && (
                                        <p className="text-xs text-muted-foreground">
                                          <span className="font-medium text-foreground">
                                            Khoảng thời gian:
                                          </span>{" "}
                                          {stat.timeframe}
                                        </p>
                                      )}
                                      {stat.baselineValue && (
                                        <p className="text-xs text-muted-foreground">
                                          <span className="font-medium text-foreground">
                                            Giá trị cơ sở:
                                          </span>{" "}
                                          {stat.baselineValue}
                                        </p>
                                      )}
                                      {stat.sourceInfo && (
                                        <p className="text-xs text-muted-foreground">
                                          <span className="font-medium text-foreground">
                                            Nguồn:
                                          </span>{" "}
                                          {stat.sourceInfo}
                                        </p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            ))}
                          </div>
                        )}

                        {benefit.features?.length > 0 && (
                          <div className="border-t border-border/30 pt-3 mt-3">
                            <div className="flex flex-wrap gap-2">
                              {benefit.features.map((feature, idx) => (
                                <Tooltip key={idx}>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant={
                                        feature.status === "available"
                                          ? "default"
                                          : "outline"
                                      }
                                      className={cn(
                                        "cursor-help transition-colors font-medium",
                                        feature.status === "available" && [
                                          "bg-primary/90 hover:bg-primary",
                                          "text-primary-foreground border-transparent",
                                        ],
                                        feature.status === "beta" && [
                                          "bg-accent hover:bg-accent/80",
                                          "text-accent-foreground",
                                          "border-accent/30 hover:border-accent/50",
                                        ],
                                        feature.status === "coming-soon" && [
                                          "bg-muted/50 hover:bg-muted/70",
                                          "text-muted-foreground/90 hover:text-muted-foreground",
                                          "border-muted-foreground/20",
                                        ],
                                      )}
                                    >
                                      {feature.name}
                                      {feature.requiresPlan && (
                                        <span className="ml-1 opacity-70 capitalize">
                                          ({feature.requiresPlan})
                                        </span>
                                      )}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="bg-popover/95 fill-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/85 border-border/50 shadow-lg"
                                  >
                                    <div className="space-y-1.5 p-1">
                                      {feature.description && (
                                        <p className="text-sm text-foreground">
                                          {feature.description}
                                        </p>
                                      )}
                                      <p className="text-xs text-muted-foreground">
                                        Trạng thái:{" "}
                                        <span
                                          className={cn(
                                            "font-medium capitalize",
                                            feature.status === "available" &&
                                              "text-primary",
                                            feature.status === "beta" &&
                                              "text-accent-foreground",
                                            feature.status === "coming-soon" &&
                                              "text-muted-foreground",
                                          )}
                                        >
                                          {feature.status}
                                        </span>
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                        )}

                        {benefit.integrations &&
                          benefit.integrations?.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ShieldCheck className="h-4 w-4 text-muted-foreground/70" />
                              <span>
                                Tích hợp với: {benefit.integrations.join(", ")}
                              </span>
                            </div>
                          )}

                        {benefit.demoUrl && (
                          <Link
                            to={benefit.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary/90 hover:text-primary transition-colors"
                          >
                            Xem demo
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </TooltipProvider>
    </section>
  );
}
