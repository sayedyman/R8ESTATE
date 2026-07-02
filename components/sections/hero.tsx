"use client"

import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { VerificationBadge } from "@/components/ui/verification-badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { CheckCircle2, Shield, Star, Award } from "lucide-react"

import { ROUTES } from "@/constants/routes"
import Link from "next/link"
import { RotatingText } from "@/components/ui/rotating-text"
import { useTranslations } from "next-intl"

export function Hero() {
  const t = useTranslations("hero")
  return (
    <section className="relative overflow-hidden bg-background pt-12 md:pt-16 lg:pt-20 pb-0">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-slate-900/[0.015] bg-[size:32px_32px]" />
      
      {/* Centered radial gradient for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3">
        <div className="h-[500px] w-[700px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      </div>
      
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          {/* Copy Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-3 md:gap-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>{t("badge")}</span>
            </div>
            
            <h1 className="flex flex-col items-center justify-center font-extrabold tracking-tight text-foreground max-w-4xl text-center">
              <span className="text-[clamp(2rem,3vw+1rem,3.5rem)] leading-tight mb-1 sm:mb-2">
                {t("headlineLine1")}
              </span>
              <RotatingText 
                className="text-[clamp(2.75rem,5vw+1.5rem,5rem)] leading-[1.1] pb-1"
                phrases={t.raw("rotatingPhrases")} 
              />
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px]">
              {t("subheadline")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full sm:w-auto">
              <Link href={`${ROUTES.ONBOARDING_GOAL}?new=true`} className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-14 px-8 text-base shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" })}>
                {t("ctaPrimary")}
              </Link>
              <Link href="#features" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto h-14 px-8 text-base bg-background/50 backdrop-blur-sm hover:bg-muted" })}>
                {t("ctaSecondary")}
              </Link>
            </div>
          </motion.div>
          
          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="w-full mt-8 md:mt-10 relative"
          >
            <div className="relative mx-auto w-full max-w-4xl rounded-[2rem] border border-border/60 bg-card p-3 md:p-4 shadow-2xl shadow-slate-200/50 backdrop-blur-sm">
              {/* Browser/App Header */}
              <div className="flex items-center gap-2 border-b border-border/40 pb-3 px-3 mb-4 md:mb-6">
                <div className="h-3 w-3 rounded-full bg-destructive/80" />
                <div className="h-3 w-3 rounded-full bg-warning/80" />
                <div className="h-3 w-3 rounded-full bg-success/80" />
              </div>
              
              <div className="p-4 md:p-8 space-y-8 md:space-y-10 text-left">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5 md:gap-6">
                    <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-background shadow-md">
                      <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop" alt="Profile" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl flex items-center gap-2">
                        Jonathan Davis 
                        <VerificationBadge />
                      </h3>
                      <p className="text-base text-muted-foreground mt-1 font-medium">Senior Property Consultant</p>
                    </div>
                  </div>
                  <div className="md:text-right flex md:flex-col items-center md:items-end gap-3 md:gap-1 bg-primary/5 p-4 rounded-2xl border border-primary/10 rtl:flip">
                    <div className="text-4xl md:text-5xl font-black text-primary leading-none rtl:flip">98</div>
                    <div className="text-xs md:text-sm font-bold text-primary/70 uppercase tracking-wider mt-1 rtl:flip">{t("trustScore")}</div>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="space-y-3 bg-muted/20 p-5 rounded-2xl border border-border/40">
                  <div className="flex justify-between text-sm font-semibold rtl:flip">
                    <span className="text-foreground">{t("verificationStrength")}</span>
                    <span className="text-success font-bold">95%</span>
                  </div>
                  <Progress value={95} className="h-3 bg-muted/50 rtl:flip" />
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 rtl:flip">
                  <div className="rounded-2xl border border-border/50 p-5 bg-background shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-base font-semibold mb-2">
                      <Star className="h-5 w-5 text-warning fill-warning" />
                      4.9 (124 {t("verifiedReviews")})
                    </div>
                    <p className="text-sm text-muted-foreground">{t("clientSatisfaction")}</p>
                  </div>
                  <div className="rounded-2xl border border-border/50 p-5 bg-background shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-base font-semibold mb-2">
                      <Award className="h-5 w-5 text-primary" />
                      {t("topAgent")}
                    </div>
                    <p className="text-sm text-muted-foreground">{t("regionalRanking")}</p>
                  </div>
                </div>
                
                {/* Checklist */}
                <div className="space-y-5 pt-6 border-t border-border/40 rtl:flip">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("verifiedCredentials")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span>{t("identityGovId")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span>{t("brokerageAffirmed")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span>{t("transactionHistory")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative float elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-4 md:-right-8 -top-8 md:-top-12 hidden sm:block rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="pr-2 text-start">
                  <p className="text-sm font-bold text-slate-900">{t("secure")}</p>
                  <p className="text-xs font-medium text-slate-500">{t("secureSubtitle")}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}
