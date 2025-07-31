'use client'

import { useEffect } from 'react'
import { PageTelemetry } from './telemetry'
import { posthogClient } from './posthog-client'
import { useUser } from './auth'
import { IS_PLATFORM } from './constants'

interface TelemetryProviderProps {
  API_URL: string
  hasAcceptedConsent: boolean
  organizationSlug?: string
  projectRef?: string
}

/**
 * Initializes PostHog client and assigns user ID to PostHog when user is logged in.
 */
export function TelemetryProvider({
  API_URL,
  hasAcceptedConsent,
  organizationSlug,
  projectRef,
}: TelemetryProviderProps) {
  const user = useUser()

  // Initialize PostHog client when telemetry is enabled
  useEffect(() => {
    if (IS_PLATFORM) {
      posthogClient.init()
    }
  }, [])

  // Identify user in PostHog when they're logged in
  useEffect(() => {
    if (IS_PLATFORM && hasAcceptedConsent && user?.id && typeof window !== 'undefined') {
      // Use same user ID as backend to unify lifecycle events
      posthogClient.identify(user.id)
    }
  }, [hasAcceptedConsent, user?.id])

  if (!IS_PLATFORM) {
    return null
  }

  return (
    <PageTelemetry
      API_URL={API_URL}
      hasAcceptedConsent={hasAcceptedConsent}
      enabled={true}
      organizationSlug={organizationSlug}
      projectRef={projectRef}
    />
  )
}
