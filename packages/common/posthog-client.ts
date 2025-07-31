import posthog from 'posthog-js'
import { PostHogConfig } from 'posthog-js'
import { subscribeKey } from 'valtio/utils'
import { consentState } from './consent-state'

interface PostHogClientConfig {
  apiKey?: string
  apiHost?: string
}

class PostHogClient {
  private initialized = false
  private pendingGroups: Record<string, string> = {}
  private config: PostHogClientConfig

  constructor(config: PostHogClientConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.NEXT_PUBLIC_POSTHOG_KEY,
      apiHost:
        config.apiHost || process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://ph.supabase.green',
    }
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return

    // Only init if consent is given
    if (!consentState.hasConsented) {
      // Listen for consent changes
      subscribeKey(consentState, 'hasConsented', () => {
        if (consentState.hasConsented) {
          this.init()
        }
      })
      return
    }

    if (!this.config.apiKey) {
      console.warn('PostHog API key not found. Skipping initialization.')
      return
    }

    const config: Partial<PostHogConfig> = {
      api_host: this.config.apiHost,
      autocapture: false, // We'll manually track events
      capture_pageview: false, // We'll manually track pageviews
      capture_pageleave: false, // We'll manually track page leaves
      loaded: (posthog) => {
        // Apply any pending groups
        Object.entries(this.pendingGroups).forEach(([type, id]) => {
          posthog.group(type, id)
        })
        this.pendingGroups = {}
      },
    }

    posthog.init(this.config.apiKey, config)
    this.initialized = true
  }

  capturePageView(properties: Record<string, any>) {
    if (!consentState.hasConsented || !this.initialized) return
    posthog.capture('$pageview', properties)
  }

  capturePageLeave(properties: Record<string, any>) {
    if (!consentState.hasConsented || !this.initialized) return
    posthog.capture('$pageleave', properties)
  }

  identify(userId: string, properties?: Record<string, any>) {
    if (!consentState.hasConsented || !this.initialized) return

    posthog.identify(userId, properties)
  }
}

export const posthogClient = new PostHogClient()
