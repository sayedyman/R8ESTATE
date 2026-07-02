"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

import { HeadphonesIcon, MessageCircleQuestion } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

const faqs = [
  {
    question: "How does a Trust Profile help my business?",
    answer: "It establishes your credibility upfront, helping to reduce client hesitation and build stronger client relationships based on transparency."
  },
  {
    question: "How is the Trust Score calculated?",
    answer: "The score is an objective reflection of your verified identity, active real estate licenses, and authenticated client reviews."
  },
  {
    question: "Can anyone leave a review on my profile?",
    answer: "No. To maintain platform integrity, reviewers must provide documentation of a completed transaction with you."
  },
  {
    question: "Is my verification data secure?",
    answer: "Yes. We use industry-standard security protocols to protect your documents. They are used exclusively for verification and are never shared."
  },
  {
    question: "How do I share my profile with prospects?",
    answer: "You receive a clean, custom URL and a downloadable QR code that integrates easily into your email signature and marketing materials."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-slate-50/50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          
          {/* Left Column */}
          <div className="space-y-8 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                <MessageCircleQuestion className="h-4 w-4 text-primary" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Everything you need to know.
              </h2>
              <p className="text-lg text-slate-600 max-w-md">
                Learn how R8ESTATE verifies credentials and helps you build a trustworthy reputation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 h-40 w-40 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                    <HeadphonesIcon className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Still have questions?</h3>
                    <p className="text-slate-600 text-base max-w-xs">
                      Our support team is here to help clarify our verification standards.
                    </p>
                  </div>
                  <div className="space-y-4 pt-2">
                    <Link href="/contact" className={buttonVariants({ size: "lg", className: "w-full shadow-md text-base h-14" })}>
                      Contact Support
                    </Link>
                    <p className="text-xs text-center font-medium text-slate-500">
                      We usually reply within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-2 lg:pt-0"
          >
            <Accordion className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 md:px-8 overflow-hidden group data-open:bg-primary/[0.02] data-open:border-primary/20 data-open:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="hover:no-underline py-6 text-left font-semibold text-lg md:text-xl text-slate-800 hover:text-primary transition-colors group-data-open:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-base md:text-lg leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
