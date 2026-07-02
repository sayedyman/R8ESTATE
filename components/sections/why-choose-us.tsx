"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import { SectionTitle } from "@/components/ui/section-title"
import { IconCard } from "@/components/ui/icon-card"
import { motion } from "framer-motion"
import { ShieldCheck, UserCheck, Share, Sparkles, Building2, Smartphone, TrendingUp } from "lucide-react"

const reasons = [
  {
    icon: Sparkles,
    title: "Professional Trust Card",
    description: "Create a professional profile that clients can confidently view and share."
  },
  {
    icon: ShieldCheck,
    title: "Build Credibility",
    description: "Showcase your identity, experience, and professional presence to build trust."
  },
  {
    icon: Share,
    title: "Share Anywhere",
    description: "Share one professional Trust Card instead of sending your information across multiple platforms."
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionTitle 
            title="The ultimate tool for professional credibility."
            subtitle="R8ESTATE helps you create a verified professional profile that instantly communicates trust. Stop sending fragmented information—share a single, verified Trust Card."
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="h-full"
            >
              <IconCard 
                icon={reason.icon}
                title={reason.title}
                description={reason.description}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
