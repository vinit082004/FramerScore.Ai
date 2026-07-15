"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  "Detecting human",
  "Detecting face",
  "Measuring blur",
  "Estimating pose",
  "Detecting background",
  "Calculating lighting",
  "Computing final score",
];

const STEP_INTERVAL_MS = 460;

export function LoadingSequence() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, STEP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {STEPS.map((step, index) => {
        const state =
          index < activeIndex ? "done" : index === activeIndex ? "active" : "pending";
        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: state === "pending" ? 0.35 : 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <span className="flex size-5 shrink-0 items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                {state === "done" ? (
                  <motion.span
                    key="done"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="size-4 text-success" strokeWidth={2} />
                  </motion.span>
                ) : state === "active" ? (
                  <motion.span
                    key="active"
                    className="size-2 rounded-full bg-brand"
                    animate={{ opacity: [1, 0.35, 1], scale: [1, 0.85, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  />
                ) : (
                  <span className="size-1.5 rounded-full bg-border" />
                )}
              </AnimatePresence>
            </span>
            <span
              className={
                state === "pending" ? "text-sm text-muted-foreground" : "text-sm text-foreground"
              }
            >
              {step}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
