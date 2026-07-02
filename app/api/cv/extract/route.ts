import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { CVImportService } from '@/lib/services/cv-import.service'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ExtractedCVData } from '@/types/cv-import.types'

export const runtime = 'nodejs'
export const maxDuration = 60

const EXTRACTION_PROMPT = `
You are a professional CV parser for a real estate agent profile builder.

Extract the following structured information from the uploaded CV document.
Return ONLY a valid JSON object. Do not include markdown, code fences, or any extra text.

Extract these fields (use null if not found):
{
  "fullName": string | null,
  "jobTitle": string | null,
  "company": string | null,
  "shortBio": string | null,
  "yearsOfExperience": string | null,
  "phone": string | null,
  "email": string | null,
  "website": string | null,
  "linkedIn": string | null,
  "specialization": string | null,
  "strengths": string[] | null,
  "experience": {
    "jobTitle": string | null,
    "company": string | null,
    "startDate": string | null,
    "endDate": string | null,
    "description": string | null
  } | null,
  "achievement": {
    "title": string | null,
    "description": string | null
  } | null
}

Rules:
- fullName: Full legal name of the person
- jobTitle: Most recent or primary job title
- company: Most recent employer or current company name
- shortBio: A 1-3 sentence professional summary or objective statement. If none, create a concise one from the career history. Preserve the user's writing style.
- yearsOfExperience: Total years in their field as a plain number string (e.g. "8")
- phone: Primary phone number in E.164 or original format
- email: Primary email address
- website: Personal or company website URL
- linkedIn: LinkedIn profile URL
- specialization: Their primary area of professional focus or expertise (one line)
- strengths: Identify exactly 1-2 strongest professional strengths/value propositions (e.g. ["Negotiation"] or ["Luxury Properties", "Lead Generation"]). If one strength clearly represents the user's expertise, return only one. Do not list generic software skills or long keyword lists. Never copy the entire Skills section from the CV.
- experience: If multiple work experiences exist, summarize the most relevant professional experience into a concise, high-quality Trust Card description rather than copying the CV verbatim.
- achievement: If multiple achievements exist, summarize the strongest and most relevant achievement into a concise, professional highlight suitable for the Trust Card.
- Never fabricate or hallucinate information. If a field cannot be confidently extracted, leave it empty (null).
`

/**
 * POST /api/cv/extract
 *
 * Accepts { path } — the Supabase Storage path from the upload step.
 * Fetches the PDF via signed URL, sends it to the Gemini AI model,
 * and returns structured ExtractedCVData as JSON.
 *
 * Authentication: requires an active session.
 */
export async function POST(request: NextRequest) {
  let requestPath: string | undefined;

  try {
    const body = await request.json()
    const { path } = body as { path?: string }
    requestPath = path;

    if (!path) {
      return NextResponse.json({ error: 'Storage path is required.' }, { status: 400 })
    }

    // Authenticate (optional)
    const session = await getServerSession(authOptions)

    // Authorization check
    if (session?.user?.id) {
      // Authenticated users can extract their own files or anonymous ones
      if (!path.startsWith(`${session.user.id}/`) && !path.startsWith('anonymous/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else {
      // Anonymous users can ONLY extract anonymous files
      if (!path.startsWith('anonymous/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Get a short-lived signed URL for the stored CV
    const signedUrl = await CVImportService.getSignedUrl(path)

    // Fetch the PDF content
    const pdfResponse = await fetch(signedUrl)
    if (!pdfResponse.ok) {
      throw new Error('Failed to retrieve CV from storage.')
    }
    const pdfBuffer = await pdfResponse.arrayBuffer()
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')

    // Check AI API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured.')
    }

    // Call Gemini AI with the PDF
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent([
      EXTRACTION_PROMPT,
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64,
        },
      },
    ])

    const responseText = result.response.text().trim()

    // Strip any accidental markdown fences if the model wraps the JSON
    const jsonText = responseText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    let extractedData: ExtractedCVData
    try {
      extractedData = JSON.parse(jsonText) as ExtractedCVData
    } catch {
      console.error('[CV Extract] Failed to parse AI response:', responseText)
      return NextResponse.json(
        { error: 'Could not parse CV data. Please fill in your details manually.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ data: extractedData }, { status: 200 })
  } catch (error) {
    console.error('[CV Extract] Error:', error)
    return NextResponse.json(
      { error: 'Extraction failed. Please try again or fill in your details manually.' },
      { status: 500 }
    )
  } finally {
    if (requestPath && requestPath.startsWith('anonymous/')) {
      await CVImportService.deleteCV(requestPath)
    }
  }
}
