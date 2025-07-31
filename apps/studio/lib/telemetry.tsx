import { TelemetryProvider } from 'common'
import { API_URL } from 'lib/constants'
import { useConsentToast } from 'ui-patterns/consent'
import { useSelectedOrganizationQuery } from 'hooks/misc/useSelectedOrganization'

export function Telemetry() {
  const { hasAcceptedConsent } = useConsentToast()

  // Get org from selected organization query because it's not
  // always available in the URL params
  const { data: organization } = useSelectedOrganizationQuery()

  return (
    <TelemetryProvider
      API_URL={API_URL}
      hasAcceptedConsent={hasAcceptedConsent}
      organizationSlug={organization?.slug}
    />
  )
}
