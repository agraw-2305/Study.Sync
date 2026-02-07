import { proxyToBackend } from '../_backend'

export async function POST(request: Request) {
  return proxyToBackend(request, '/api/flashcards', {
    errorMessage: 'Failed to generate flashcards',
    includeCount: true,
  })
}
