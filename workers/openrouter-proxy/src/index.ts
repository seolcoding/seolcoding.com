interface Env {
  OPENROUTER_API_KEY: string;
}

// 허용 Origin (seolcoding.com + www + localhost)
const ALLOWED_ORIGINS = [
  'https://seolcoding.com',
  'https://www.seolcoding.com',
  'http://localhost:5173',  // Vite dev
  'http://localhost:3000',
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';

    // Origin 검증
    const isAllowed = ALLOWED_ORIGINS.includes(origin);
    if (!isAllowed && origin !== '') {
      return new Response('Forbidden', { status: 403 });
    }

    // CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // POST만 허용
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      // 요청 본문 검증
      const body = await request.json() as Record<string, unknown>;

      // 모델 고정 (openai/gpt-oss-120b만 허용)
      if (body.model && body.model !== 'openai/gpt-oss-120b') {
        body.model = 'openai/gpt-oss-120b';
      }

      // max_tokens 제한 (2000)
      if (!body.max_tokens || (body.max_tokens as number) > 2000) {
        body.max_tokens = 2000;
      }

      // OpenRouter URL 구성 (기존 경로 유지)
      const url = new URL(request.url);
      const openrouterPath = url.pathname;  // /v1/chat/completions 등
      const openrouterUrl = `https://openrouter.ai/api${openrouterPath}`;

      // OpenRouter 호출
      const response = await fetch(openrouterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://seolcoding.com',
          'X-Title': 'Prompt Engineering Tutorial',
        },
        body: JSON.stringify(body),
      });

      // 응답 반환 (스트리밍 지원)
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
          'Access-Control-Allow-Origin': origin,
        },
      });

    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(
        JSON.stringify({ error: 'Service unavailable' }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin,
          },
        }
      );
    }
  },
};
