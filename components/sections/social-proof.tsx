"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import { motion } from "framer-motion"

const metrics = [
  { id: 1, label: "Professional Reputation Platform" },
  { id: 2, label: "Verified Profiles" },
  { id: 3, label: "Built for Real Estate Professionals" },
]

export function SocialProof() {
  return (
    <section className="border-y border-border/50 bg-muted/20 py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center md:text-left"
            >
              <p className="text-sm font-semibold text-foreground uppercase tracking-widest whitespace-nowrap">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
