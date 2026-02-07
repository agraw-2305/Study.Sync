import { proxyToBackend } from '../_backend'

export async function POST(request: Request) {
  return proxyToBackend(request, '/api/notes', {
    errorMessage: 'Failed to generate notes',
  })
}
