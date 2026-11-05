import createClient from 'openapi-fetch';
import type { components, paths } from './api-types';

type Schemas = components['schemas'];
type ApiError = Schemas['ErrorResponse']['error'];
type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: ApiError };

// The browser goes through the Next.js `/api` rewrite (one origin, no CORS); the server calls
// the backend directly.
const baseUrl =
  typeof window === 'undefined' ? (process.env.BACKEND_URL ?? 'http://localhost:4000') : '';

const client = createClient<paths>({ baseUrl });

function isApiError(value: unknown): value is { error: ApiError } {
  return typeof value === 'object' && value !== null && 'error' in value;
}

async function unwrap<T>(
  call: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<ApiResult<T>> {
  try {
    const { data, error, response } = await call;
    if (response.ok && data !== undefined) return { ok: true, data };
    if (isApiError(error)) return { ok: false, status: response.status, error: error.error };
    return {
      ok: false,
      status: response.status,
      error: { code: 'internal_error', message: 'Unexpected response from the server' },
    };
  } catch {
    return {
      ok: false,
      status: 0,
      error: { code: 'internal_error', message: 'Could not reach the server' },
    };
  }
}

const api = {
  getCarriers: () => unwrap(client.GET('/api/v1/carriers')),
  getCarrierForm: (id: string) =>
    unwrap(client.GET('/api/v1/carriers/{id}/form', { params: { path: { id } } })),
  getCustomer: (id: string) =>
    unwrap(client.GET('/api/v1/customers/{id}', { params: { path: { id } } })),
  prefill: (carrierId: string, customerId: string) =>
    unwrap(
      client.GET('/api/v1/forms/{carrierId}/prefill', {
        params: { path: { carrierId }, query: { customerId } },
      }),
    ),
  checkEligibility: (carrierId: string, body: Schemas['EligibilityRequest']) =>
    unwrap(
      client.POST('/api/v1/carriers/{id}/eligibility', {
        params: { path: { id: carrierId } },
        body,
      }),
    ),
  createQuote: (carrierId: string, body: Schemas['QuoteCreateRequest']) =>
    unwrap(
      client.POST('/api/v1/carriers/{id}/quotes', { params: { path: { id: carrierId } }, body }),
    ),
};

export { type ApiError, type ApiResult, type Schemas, api };
