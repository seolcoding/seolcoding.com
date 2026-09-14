export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    if (incoming.pathname === "/sinokorapp" || incoming.pathname.startsWith("/sinokorapp/")) {
      const upstream = new URL(incoming.pathname + incoming.search, "https://seolcoding.pages.dev");
      return fetch(new Request(upstream, request));
    }
    return Response.redirect(
      "https://app.notion.com/p/atoye/AI-Agent-3cbda0eced9981bb8577c19a5885e8b0?source=copy_link",
      302,
    );
  },
};
