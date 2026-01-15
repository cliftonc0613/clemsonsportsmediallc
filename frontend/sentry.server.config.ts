// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Disable telemetry data collection
  sendDefaultPii: false,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Enable Spotlight for local development (https://spotlightjs.com)
  spotlight: process.env.NODE_ENV === 'development' && !!process.env.SENTRY_SPOTLIGHT,

  // Only initialize if DSN is provided
  enabled: !!process.env.SENTRY_DSN,
})
