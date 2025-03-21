import '@testing-library/jest-dom'
import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { loadEnvConfig } from '@next/env'
import { fetch, Headers, Request, Response } from 'cross-fetch'
import { server } from './mocks/server'

// Load environment variables from .env.test
const projectDir = process.cwd()
loadEnvConfig(projectDir, true)

// Verify environment variables are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Required environment variables are not loaded. Check .env.test file.')
}

// Make fetch available globally
if (!globalThis.fetch) {
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
}

// Extend Vitest's expect with Testing Library's matchers
expect.extend(matchers)

beforeAll(() => {
  // Start the MSW server before all tests
  server.listen({
    onUnhandledRequest: (req, print) => {
      console.log(`[MSW] Unhandled ${req.method} request to ${req.url}`)
      print.warning()
    },
  })
})

afterAll(() => {
  // Clean up after all tests are done
  server.close()
})

afterEach(() => {
  // Reset handlers after each test
  server.resetHandlers()
  // Clean up any mounted React components
  cleanup()
}) 