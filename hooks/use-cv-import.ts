import { useState } from 'react'
import type { ExtractedCVData, CVImportStep } from '@/types/cv-import.types'

interface UseCVImportReturn {
  step: CVImportStep
  error: string | null
  extractedData: ExtractedCVData | null
  isLoading: boolean
  uploadAndExtract: (file: File) => Promise<void>
  reset: () => void
}

/**
 * useCVImport — client hook encapsulating the full CV import pipeline.
 *
 * Orchestrates:
 * 1. POST /api/cv/upload  → receives Supabase storage path
 * 2. POST /api/cv/extract → receives structured ExtractedCVData
 *
 * The hook never touches AI or storage directly — all business logic
 * is on the server side.
 */
export function useCVImport(): UseCVImportReturn {
  const [step, setStep] = useState<CVImportStep>('upload')
  const [error, setError] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractedCVData | null>(null)

  const isLoading = step === 'processing'

  const uploadAndExtract = async (file: File) => {
    setStep('processing')
    setError(null)

    try {
      // Step 1: Upload the PDF
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadResponse = await fetch('/api/cv/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const body = await uploadResponse.json()
        throw new Error(body.error || 'Upload failed.')
      }

      const { path } = await uploadResponse.json()

      // Step 2: Extract structured data using AI
      const extractResponse = await fetch('/api/cv/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })

      if (!extractResponse.ok) {
        const body = await extractResponse.json()
        throw new Error(body.error || 'Extraction failed.')
      }

      const { data } = await extractResponse.json()
      setExtractedData(data)
      setStep('review')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
      setStep('error')
    }
  }

  const reset = () => {
    setStep('upload')
    setError(null)
    setExtractedData(null)
  }

  return { step, error, extractedData, isLoading, uploadAndExtract, reset }
}
