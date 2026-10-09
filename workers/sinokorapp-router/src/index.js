// seolcoding.com(www 없는 주소)으로 들어온 요청을 처리한다.
// /sinokorapp, /erp 는 Pages 원본으로 그대로 넘기고, 나머지는 www 홈페이지의 같은 경로로 보낸다.
// (2026-10-09 이전에는 나머지를 Notion 페이지로 보냈다. 사용자 지시로 홈페이지로 바꿈.)
const PROXIED_PREFIXES = ["/sinokorapp", "/erp"];
const HOME = "https://www.seolcoding.com";

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const proxied = PROXIED_PREFIXES.some(
      (prefix) => incoming.pathname === prefix || incoming.pathname.startsWith(`${prefix}/`),
    );
    if (proxied) {
      const upstream = new URL(incoming.pathname + incoming.search, "https://seolcoding.pages.dev");
      return fetch(new Request(upstream, request));
    }
    return Response.redirect(HOME + incoming.pathname + incoming.search, 301);
  },
};
