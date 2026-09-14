export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const upstream = new URL(incoming.pathname + incoming.search, "https://seolcoding.pages.dev");
    return fetch(new Request(upstream, request));
  },
};
