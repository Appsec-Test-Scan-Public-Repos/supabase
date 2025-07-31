'use client'

import { TelemetryProvider } from 'common'
import { useConsentToast } from 'ui-patterns/consent'
import { API_URL } from '~/lib/constants'

const PageTelemetry = () => {
  const { hasAcceptedConsent } = useConsentToast()

  return <TelemetryProvider API_URL={API_URL} hasAcceptedConsent={hasAcceptedConsent} />
}

export { PageTelemetry }
