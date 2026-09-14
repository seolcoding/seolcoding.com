const PROXIED_PREFIXES = ["/sinokorapp", "/erp"];

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
    return Response.redirect(
      "https://app.notion.com/p/atoye/AI-Agent-3cbda0eced9981bb8577c19a5885e8b0?source=copy_link",
      302,
    );
  },
};
