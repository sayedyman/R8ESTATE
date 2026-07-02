import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { 
  InsightCard, 
  Recommendation, 
  RecentActivityItem 
} from '@/types/dashboard'
import { 
  Eye, 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  Globe, 
  Share2, 
  QrCode 
} from 'lucide-react'
import { Linkedin } from '@/components/ui/social-icons'

export type AnalyticsEventType = 
  | 'profile_view'
  | 'phone_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'website_click'
  | 'linkedin_click'
  | 'profile_share'
  | 'qr_scan'

export interface EventPayload {
  ownerUserId: string
  eventType: AnalyticsEventType
  source?: string
  metadata?: Record<string, any>
  visitorId?: string
}

export class AnalyticsService {
  private supabase: SupabaseClient<Database>

  constructor(supabaseClient?: SupabaseClient<Database>) {
    this.supabase = supabaseClient || createBrowserClient()
  }

  /**
   * Tracks an interaction event.
   */
  async trackEvent(payload: EventPayload): Promise<void> {
    const { error } = await this.supabase
      .from('analytics_events')
      .insert({
        owner_user_id: payload.ownerUserId,
        event_type: payload.eventType,
        source: payload.source || 'web',
        metadata: payload.metadata || {},
        visitor_id: payload.visitorId || null
      })

    if (error) {
      console.error(`Error tracking event ${payload.eventType}:`, error.message)
      throw error
    }
  }

  /**
   * Loads aggregated analytics metrics and insights for the dashboard.
   * Executes a single query covering the last 90 days of events to pre-fill all analytics widgets.
   */
  async getDashboardAnalytics(ownerUserId: string): Promise<{
    views: number
    clicks: number
    conversations: number
    contactRate: number
    chartData: {
      today: { name: string; views: number; clicks: number }[]
      "last-7-days": { name: string; views: number; clicks: number }[]
      "last-30-days": { name: string; views: number; clicks: number }[]
      "last-90-days": { name: string; views: number; clicks: number }[]
    }
    growthPercent: number
    bestDay: string
    recentActivity: RecentActivityItem[]
    insights: InsightCard[]
    recommendations: Recommendation[]
    hasNoAnalytics: boolean
  }> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 90)

    const { data: events, error } = await this.supabase
      .from('analytics_events')
      .select('event_type, created_at')
      .eq('owner_user_id', ownerUserId)
      .gte('created_at', startDate.toISOString())

    if (error) {
      console.error(`Error fetching analytics for user ${ownerUserId}:`, error.message)
      throw error
    }

    const totalEvents = events || []

    // 1. Calculate General Aggregates
    const views = totalEvents.filter(e => e.event_type === 'profile_view' || e.event_type === 'qr_scan').length
    
    const phoneClicks = totalEvents.filter(e => e.event_type === 'phone_click').length
    const whatsappClicks = totalEvents.filter(e => e.event_type === 'whatsapp_click').length
    const emailClicks = totalEvents.filter(e => e.event_type === 'email_click').length
    const websiteClicks = totalEvents.filter(e => e.event_type === 'website_click').length
    const linkedinClicks = totalEvents.filter(e => e.event_type === 'linkedin_click').length
    const qrScans = totalEvents.filter(e => e.event_type === 'qr_scan').length
    const shares = totalEvents.filter(e => e.event_type === 'profile_share').length

    const clicks = phoneClicks + whatsappClicks + emailClicks + websiteClicks + linkedinClicks
    const conversations = phoneClicks + whatsappClicks
    const contactRate = views > 0 ? Math.round((clicks / views) * 100) : 0

    // 2. Fetch User Profile for Complete contextual details
    const { data: userCard } = await this.supabase
      .from('trust_cards')
      .select('profile_completion, verification_status')
      .eq('user_id', ownerUserId)
      .maybeSingle()

    const profileData = {
      profileCompletion: userCard?.profile_completion ? Number(userCard.profile_completion) : 0,
      verificationStatus: userCard?.verification_status || 'Pending'
    }

    // 3. Generate Charts Data
    // Today Hourly
    const todayData: { name: string; views: number; clicks: number }[] = []
    const todayStr = new Date().toDateString()
    const todayEvents = totalEvents.filter(e => new Date(e.created_at).toDateString() === todayStr)
    const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
    hours.forEach(hour => {
      const h = parseInt(hour.split(':')[0])
      const hEvents = todayEvents.filter(e => {
        const d = new Date(e.created_at)
        return d.getHours() >= h - 1 && d.getHours() < h + 1
      })
      todayData.push({
        name: hour,
        views: hEvents.filter(e => e.event_type === 'profile_view' || e.event_type === 'qr_scan').length,
        clicks: hEvents.filter(e => ['phone_click', 'whatsapp_click', 'email_click', 'website_click', 'linkedin_click'].includes(e.event_type)).length
      })
    })

    // Last 7 Days
    const last7DaysData: { name: string; views: number; clicks: number }[] = []
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayLabel = daysOfWeek[date.getDay()]
      const dayEvents = totalEvents.filter(e => new Date(e.created_at).toDateString() === date.toDateString())
      last7DaysData.push({
        name: dayLabel,
        views: dayEvents.filter(e => e.event_type === 'profile_view' || e.event_type === 'qr_scan').length,
        clicks: dayEvents.filter(e => ['phone_click', 'whatsapp_click', 'email_click', 'website_click', 'linkedin_click'].includes(e.event_type)).length
      })
    }

    // Last 30 Days (4 Weeks)
    const last30DaysData: { name: string; views: number; clicks: number }[] = []
    for (let w = 3; w >= 0; w--) {
      const wEvents = totalEvents.filter(e => {
        const diffTime = Math.abs(new Date().getTime() - new Date(e.created_at).getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > w * 7 && diffDays <= (w + 1) * 7
      })
      last30DaysData.push({
        name: `Week ${4 - w}`,
        views: wEvents.filter(e => e.event_type === 'profile_view' || e.event_type === 'qr_scan').length,
        clicks: wEvents.filter(e => ['phone_click', 'whatsapp_click', 'email_click', 'website_click', 'linkedin_click'].includes(e.event_type)).length
      })
    }

    // Last 90 Days (3 Months)
    const last90DaysData: { name: string; views: number; clicks: number }[] = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for (let m = 2; m >= 0; m--) {
      const date = new Date()
      date.setMonth(date.getMonth() - m)
      const mEvents = totalEvents.filter(e => {
        const d = new Date(e.created_at)
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
      })
      last90DaysData.push({
        name: months[date.getMonth()],
        views: mEvents.filter(e => e.event_type === 'profile_view' || e.event_type === 'qr_scan').length,
        clicks: mEvents.filter(e => ['phone_click', 'whatsapp_click', 'email_click', 'website_click', 'linkedin_click'].includes(e.event_type)).length
      })
    }

    // 4. Calculate Growth Statistics
    const last7DaysEvents = totalEvents.filter(e => {
      const diffDays = Math.ceil((new Date().getTime() - new Date(e.created_at).getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    })
    const prev7DaysEvents = totalEvents.filter(e => {
      const diffDays = Math.ceil((new Date().getTime() - new Date(e.created_at).getTime()) / (1000 * 60 * 60 * 24))
      return diffDays > 7 && diffDays <= 14
    })
    const currentViews = last7DaysEvents.filter(e => e.event_type === 'profile_view' || e.event_type === 'qr_scan').length
    const prevViews = prev7DaysEvents.filter(e => e.event_type === 'profile_view' || e.event_type === 'qr_scan').length
    const growthPercent = prevViews > 0 ? Math.round(((currentViews - prevViews) / prevViews) * 100) : 0

    // Find Best Day
    let bestDay = "None"
    let maxViews = -1
    last7DaysData.forEach(d => {
      if (d.views > maxViews) {
        maxViews = d.views
        bestDay = d.name
      }
    })

    // 5. Query Recent Activity Log
    const { data: recentEvents } = await this.supabase
      .from('analytics_events')
      .select('*')
      .eq('owner_user_id', ownerUserId)
      .order('created_at', { ascending: false })
      .limit(5)

    const activityIcons: Record<string, any> = {
      profile_view: Eye,
      phone_click: PhoneCall,
      whatsapp_click: MessageCircle,
      email_click: Mail,
      website_click: Globe,
      linkedin_click: Linkedin,
      profile_share: Share2,
      qr_scan: QrCode
    }

    const activityTexts: Record<string, string> = {
      profile_view: "Someone viewed your profile",
      phone_click: "Someone clicked your phone number",
      whatsapp_click: "Someone opened WhatsApp from your profile",
      email_click: "Someone clicked your email link",
      website_click: "Someone visited your website",
      linkedin_click: "Someone clicked your LinkedIn profile",
      profile_share: "Your Trust Card was shared via link",
      qr_scan: "Someone scanned your QR Code"
    }

    const activityColors: Record<string, string> = {
      profile_view: "text-slate-600",
      phone_click: "text-blue-600",
      whatsapp_click: "text-green-600",
      email_click: "text-sky-600",
      website_click: "text-indigo-600",
      linkedin_click: "text-blue-700",
      profile_share: "text-purple-600",
      qr_scan: "text-amber-600"
    }

    const activityBgs: Record<string, string> = {
      profile_view: "bg-slate-100",
      phone_click: "bg-blue-50",
      whatsapp_click: "bg-green-50",
      email_click: "bg-sky-50",
      website_click: "bg-indigo-50",
      linkedin_click: "bg-blue-50",
      profile_share: "bg-purple-50",
      qr_scan: "bg-amber-50"
    }

    const getRelativeTime = (dateString: string): string => {
      const diffMs = new Date().getTime() - new Date(dateString).getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins} mins ago`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    }

    const mappedActivities: RecentActivityItem[] = (recentEvents || []).map((e, idx) => ({
      id: idx + 1,
      icon: activityIcons[e.event_type] || Eye,
      text: activityTexts[e.event_type] || "Interaction logged",
      time: getRelativeTime(e.created_at),
      color: activityColors[e.event_type] || "text-slate-600",
      bg: activityBgs[e.event_type] || "bg-slate-100"
    }))

    // 6. Generate Contextual Insights & Recommendations using Business Rules
    const metricsPayload = {
      views,
      clicks,
      contactRate,
      phone: phoneClicks,
      whatsapp: whatsappClicks,
      email: emailClicks,
      website: websiteClicks,
      linkedin: linkedinClicks,
      share: shares,
      qr: qrScans
    }

    const insights = this.generateDynamicInsights(metricsPayload, profileData, growthPercent)
    const recommendations = this.generateDynamicRecommendations(metricsPayload, profileData)

    return {
      views,
      clicks,
      conversations,
      contactRate,
      chartData: {
        today: todayData,
        "last-7-days": last7DaysData,
        "last-30-days": last30DaysData,
        "last-90-days": last90DaysData
      },
      growthPercent,
      bestDay,
      recentActivity: mappedActivities,
      insights,
      recommendations,
      hasNoAnalytics: views === 0
    }
  }

  /**
   * Generates business insights dynamically from analytics metrics and user profile status.
   */
  private generateDynamicInsights(
    metrics: { views: number; clicks: number; contactRate: number; phone: number; whatsapp: number; email: number; website: number; linkedin: number; share: number; qr: number },
    profile: { profileCompletion: number; verificationStatus: string },
    growthPercent: number
  ): InsightCard[] {
    const insights: InsightCard[] = []

    // 1. If Profile Views == 0
    if (metrics.views === 0) {
      insights.push({
        id: "insight-views-0",
        title: "Visitor Traffic",
        content: "Your profile hasn't received any views yet. Share your Trust Card link on social media or email signatures to get started.",
        isPositive: false
      })
    }

    // 2. If Contact Rate < 10%
    if (metrics.views > 0 && metrics.contactRate < 10) {
      insights.push({
        id: "insight-rate-low",
        title: "Conversion Opportunity",
        content: "Your contact conversion rate is under 10%. Consider refining your specialization headline or adding a clear profile photo to build trust.",
        isPositive: false
      })
    }

    // 3. If WhatsApp Clicks == 0
    if (metrics.views > 0 && metrics.whatsapp === 0) {
      insights.push({
        id: "insight-whatsapp-0",
        title: "Contact Preference",
        content: "No WhatsApp click events recorded. Make sure your WhatsApp connection details are visible and active, as most clients prefer chat.",
        isPositive: undefined
      })
    }

    // 4. If Profile Completion < 80%
    if (profile.profileCompletion < 80) {
      insights.push({
        id: "insight-completion",
        title: "Profile Strength",
        content: `Your profile completion is at ${profile.profileCompletion}%. Complete all fields (experience, achievement) to increase visitor confidence and conversions.`,
        isPositive: false
      })
    }

    // 5. If Website Clicks are highest
    const clickMetrics = [
      { type: 'Phone', value: metrics.phone },
      { type: 'WhatsApp', value: metrics.whatsapp },
      { type: 'Email', value: metrics.email },
      { type: 'Website', value: metrics.website },
      { type: 'LinkedIn', value: metrics.linkedin }
    ]
    const highestClick = clickMetrics.reduce((prev, current) => (prev.value > current.value) ? prev : current)
    if (highestClick.value > 0 && highestClick.type === 'Website') {
      insights.push({
        id: "insight-website-high",
        title: "Conversion Channel",
        content: "Your website is currently your strongest conversion channel. Ensure your website link highlights your active listings or booking calendar.",
        isPositive: true
      })
    }

    // 6. If QR traffic is highest
    if (metrics.qr > 0 && metrics.qr >= metrics.share && metrics.qr >= metrics.views * 0.3) {
      insights.push({
        id: "insight-qr-high",
        title: "Traffic Source",
        content: "QR code scans are driving a significant portion of your traffic. Share your physical QR code on business cards and signs.",
        isPositive: true
      })
    }

    // 7. If traffic increased this week
    if (growthPercent > 0) {
      insights.push({
        id: "insight-growth",
        title: "Growth Summary",
        content: `Your profile views increased by ${growthPercent}% this week. Continue sharing your profile to maintain this positive trajectory.`,
        isPositive: true
      })
    }

    // 8. If visitors are viewing but not contacting
    if (metrics.views > 5 && metrics.clicks === 0) {
      insights.push({
        id: "insight-view-no-contact",
        title: "Conversion Drop-off",
        content: "Visitors are viewing your Trust Card but not reaching out. Try writing a more compelling short bio or adding client achievements.",
        isPositive: false
      })
    }

    // Keep at least two insights for spacing layout
    if (insights.length < 2) {
      insights.push({
        id: "insight-default-1",
        title: "Identity Verification",
        content: profile.verificationStatus === "Verified" 
          ? "Your identity verification is active, which boosts profile visitor trust by up to 40%."
          : "Your identity verification is pending. Verify your license to earn the verified profile badge.",
        isPositive: profile.verificationStatus === "Verified"
      })
    }
    if (insights.length < 2) {
      insights.push({
        id: "insight-default-2",
        title: "Proactive Sharing",
        content: "Add your Trust Card QR code to listing brochures and yard signs for immediate client validation.",
        isPositive: true
      })
    }

    return insights.slice(0, 3)
  }

  /**
   * Generates dynamic actionable recommendations based on live metrics and profile data.
   */
  private generateDynamicRecommendations(
    metrics: { views: number; clicks: number; contactRate: number; phone: number; whatsapp: number; email: number; website: number; linkedin: number; share: number; qr: number },
    profile: { profileCompletion: number; verificationStatus: string }
  ): Recommendation[] {
    const recs: Recommendation[] = []

    // 1. Views == 0 -> Share Profile
    if (metrics.views === 0) {
      recs.push({
        id: 1,
        title: "Share Your Trust Card Link",
        action: "Share Profile",
        priority: "High",
        icon: "🔗",
        impact: "High",
        description: "Start driving traffic to your Trust Card by copying your public profile link and sharing it."
      })
    }

    // 2. Profile Completion < 80% -> Complete Profile
    if (profile.profileCompletion < 80) {
      recs.push({
        id: 2,
        title: "Complete All Profile Fields",
        action: "Edit Profile",
        priority: "High",
        icon: "📝",
        impact: "High",
        description: `Your profile is only ${profile.profileCompletion}% complete. Add your short bio, experience, or achievement details.`
      })
    }

    // 3. Contact Rate < 10% -> Improve headline
    if (metrics.views > 0 && metrics.contactRate < 10) {
      recs.push({
        id: 3,
        title: "Refine Your Specialization Headline",
        action: "Edit Profile",
        priority: "Medium",
        icon: "⚡",
        impact: "Medium",
        description: "A clear specialization headline helps target the right audience and improves contact rates."
      })
    }

    // 4. WhatsApp Clicks == 0 -> Add WhatsApp/Verify
    if (metrics.views > 0 && metrics.whatsapp === 0) {
      recs.push({
        id: 4,
        title: "Verify WhatsApp Contact Details",
        action: "Edit Profile",
        priority: "Medium",
        icon: "💬",
        impact: "High",
        description: "No WhatsApp clicks recorded. Make sure your WhatsApp connection is properly configured."
      })
    }

    // 5. QR traffic highest -> Recommend continuing QR sharing
    if (metrics.qr > 0 && metrics.qr >= metrics.share) {
      recs.push({
        id: 5,
        title: "Promote QR Code on Print Media",
        action: "Share Profile",
        priority: "Low",
        icon: "📱",
        impact: "Medium",
        description: "Your QR code is driving traffic. Add it to physical signage, listing folders, and mailers."
      })
    }

    // 6. Identity pending -> Recommend completing verification
    if (profile.verificationStatus !== "Verified") {
      recs.push({
        id: 6,
        title: "Complete Identity Verification",
        action: "Verify Now",
        priority: "Medium",
        icon: "🛡️",
        impact: "High",
        description: "Verify your real estate license to display the verified reputation badge."
      })
    }

    // Fallbacks
    if (recs.length < 3) {
      recs.push({
        id: 7,
        title: "Update Professional Achievements",
        action: "Edit Profile",
        priority: "Low",
        icon: "🏆",
        impact: "Medium",
        description: "Highlighting recent sales or awards builds instant trust and conversion numbers."
      })
    }

    return recs.slice(0, 3)
  }
}
