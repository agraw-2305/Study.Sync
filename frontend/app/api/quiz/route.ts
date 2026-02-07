import { proxyToBackend } from '../_backend'

export async function POST(request: Request) {
  return proxyToBackend(request, '/api/quiz', {
    errorMessage: 'Failed to generate quiz',
    includeCount: true,
  })
}
