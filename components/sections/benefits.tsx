"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import { SectionTitle } from "@/components/ui/section-title"
import { FeatureCard } from "@/components/ui/feature-card"
import { motion } from "framer-motion"
import { Shield, Target, UserCheck, Share2, Star, Lock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Build Trust Faster",
    description: "Build trust before the first meeting with verified professional credentials."
  },
  {
    icon: UserCheck,
    title: "Verified Credentials",
    description: "Verify your identity and licenses through official records."
  },
  {
    icon: Star,
    title: "Authentic Reviews",
    description: "Reviews come only from verified completed transactions."
  },
  {
    icon: Target,
    title: "Stand Out",
    description: "Make a strong first impression with an independently verified track record."
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your verified profile via link or QR code."
  },
  {
    icon: Lock,
    title: "Data Privacy",
    description: "Your verification data remains private and secure."
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export function Benefits() {
  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionTitle 
            title="The Foundation of Professional Trust"
            subtitle="Equip yourself with the verified credentials you need to demonstrate your credibility and build stronger client relationships."
          />
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
