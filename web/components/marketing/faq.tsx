import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "What image formats are supported?",
    answer: "FrameScore AI accepts PNG, JPEG, and WEBP files up to 20MB per image.",
  },
  {
    question: "How is the score calculated?",
    answer:
      "Each image is measured across nine parameters — face visibility, orientation, sharpness, subject count, movement, centering, lighting, resolution, and background — using computer vision. The scores are combined into one weighted overall suitability score.",
  },
  {
    question: "Are uploaded images stored?",
    answer:
      "Images and their reports are saved to your history so you can revisit past evaluations, compare results, and export reports later. You can delete any analysis, or clear your entire history, from Settings.",
  },
  {
    question: "Can I compare multiple images at once?",
    answer:
      "Yes. The Compare tool accepts 2–6 images and highlights the best, second-best, and worst image based on overall score.",
  },
  {
    question: "What can I export?",
    answer: "Every report can be exported as a PDF, JSON, or CSV file from its detail page or the Reports tab.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-border bg-card">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Frequently asked questions
        </h2>
        <Accordion className="mt-10">
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
