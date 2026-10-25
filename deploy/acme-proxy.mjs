// Temporary, loopback-only CONNECT relay for ACME when origin egress is unavailable.
// TLS and certificate/account private keys remain on the server.
import http from "node:http";
import net from "node:net";

const allowedHosts = new Set([
  "acme-v02.api.letsencrypt.org",
  "acme-staging-v02.api.letsencrypt.org",
]);
const server = http.createServer((_, response) => response.writeHead(403).end());
server.on("connect", (request, client, head) => {
  const [hostname, port] = (request.url ?? "").split(":");
  if (!allowedHosts.has(hostname) || port !== "443") {
    client.end("HTTP/1.1 403 Forbidden\r\n\r\n");
    return;
  }
  const upstream = net.connect(443, hostname, () => {
    client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    if (head.length) upstream.write(head);
    client.pipe(upstream);
    upstream.pipe(client);
  });
  upstream.on("error", () => client.destroy());
  client.on("error", () => upstream.destroy());
  client.on("close", () => upstream.destroy());
  upstream.on("close", () => client.destroy());
});
server.listen(18091, "127.0.0.1", () => process.stdout.write("ACME relay on 127.0.0.1:18091\n"));
