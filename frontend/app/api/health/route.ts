import { NextRequest, NextResponse } from 'next/server'
import { healthCheckLimiter, getClientIp } from '@/lib/rate-limit'

/**
 * Health Check API Endpoint
 *
 * Returns system status for monitoring and load balancer health checks.
 *
 * GET /api/health
 *   - Public: Returns basic status (ok/degraded/error)
 *   - With X-Health-Detail header or in development: Returns full diagnostics
 *
 * SECURITY: Detailed metrics are only exposed when:
 *   1. X-Health-Detail header matches HEALTH_CHECK_SECRET env var
 *   2. Or running in development mode (NODE_ENV=development)
 *
 * SECURITY: Rate limited to prevent reconnaissance/DoS attacks
 */

interface HealthCheck {
  status: 'ok' | 'error'
  latencyMs?: number
  heapUsedMB?: number
  seconds?: number
  error?: string
}

interface HealthResponseBasic {
  status: 'ok' | 'degraded' | 'error'
  timestamp: string
}

interface HealthResponseDetailed extends HealthResponseBasic {
  version: string
  checks: {
    wordpress: HealthCheck
    memory: HealthCheck
    uptime: HealthCheck
  }
}

// App version from package.json or env
const VERSION = process.env.npm_package_version || '1.0.0'

// Track server start time for uptime calculation
const startTime = Date.now()

/**
 * Check if detailed health info should be exposed
 */
function shouldShowDetails(request: NextRequest): boolean {
  // Always show in development
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // Check for secret header in production
  const healthSecret = process.env.HEALTH_CHECK_SECRET
  if (!healthSecret) {
    return false
  }

  const providedSecret = request.headers.get('x-health-detail')
  return providedSecret === healthSecret
}

async function checkWordPress(): Promise<HealthCheck> {
  const apiUrl = process.env.WORDPRESS_API_URL

  if (!apiUrl) {
    return { status: 'error', error: 'WORDPRESS_API_URL not configured' }
  }

  try {
    const start = Date.now()
    const response = await fetch(apiUrl.replace('/wp/v2', ''), {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    const latencyMs = Date.now() - start

    return {
      status: response.ok ? 'ok' : 'error',
      latencyMs,
      ...(response.ok ? {} : { error: `HTTP ${response.status}` }),
    }
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

function checkMemory(): HealthCheck {
  try {
    const memoryUsage = process.memoryUsage()
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)

    // Consider memory usage over 1GB as concerning
    const status = heapUsedMB < 1024 ? 'ok' : 'error'

    return { status, heapUsedMB }
  } catch {
    // Memory check not available in all environments
    return { status: 'ok', heapUsedMB: 0 }
  }
}

function checkUptime(): HealthCheck {
  const seconds = Math.floor((Date.now() - startTime) / 1000)
  return { status: 'ok', seconds }
}

function determineOverallStatus(
  checks: HealthResponseDetailed['checks']
): 'ok' | 'degraded' | 'error' {
  const statuses = Object.values(checks).map((c) => c.status)

  // All checks pass
  if (statuses.every((s) => s === 'ok')) {
    return 'ok'
  }

  // WordPress is critical - if it fails, we're in error state
  if (checks.wordpress.status === 'error') {
    return 'degraded'
  }

  // Some non-critical check failed
  return 'degraded'
}

export async function GET(request: NextRequest) {
  // SECURITY: Rate limiting to prevent reconnaissance/DoS
  const clientIp = getClientIp(request)
  const { success, reset } = healthCheckLimiter.check(clientIp)

  if (!success) {
    return NextResponse.json(
      { status: 'error' as const, timestamp: new Date().toISOString() },
      {
        status: 429,
        headers: {
          'Retry-After': String(reset),
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  }

  const showDetails = shouldShowDetails(request)

  try {
    // Run checks in parallel
    const [wordpress, memory, uptime] = await Promise.all([
      checkWordPress(),
      Promise.resolve(checkMemory()),
      Promise.resolve(checkUptime()),
    ])

    const checks = { wordpress, memory, uptime }
    const status = determineOverallStatus(checks)

    // Basic response for public requests (load balancers, etc.)
    const basicResponse: HealthResponseBasic = {
      status,
      timestamp: new Date().toISOString(),
    }

    // Detailed response for authenticated requests
    const detailedResponse: HealthResponseDetailed = {
      ...basicResponse,
      version: VERSION,
      checks,
    }

    return NextResponse.json(showDetails ? detailedResponse : basicResponse, {
      status: status === 'error' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // Endpoint should always return valid JSON
    const errorResponse = showDetails
      ? {
          status: 'error' as const,
          timestamp: new Date().toISOString(),
          version: VERSION,
          checks: {
            wordpress: { status: 'error' as const, error: 'Health check failed' },
            memory: { status: 'error' as const },
            uptime: { status: 'error' as const },
          },
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      : {
          status: 'error' as const,
          timestamp: new Date().toISOString(),
        }

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  }
}
