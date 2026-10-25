import assert from "node:assert/strict";

const origin = "https://hosseinmokhtari.ir";
const request = path => fetch(new URL(path, origin), { signal: AbortSignal.timeout(20000) });
const sitemap = await request("/sitemap-0.xml").then(response => response.text());
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 19, "Expected home, about and 17 projects in sitemap");
for (let index = 0; index < urls.length; index += 4) {
  await Promise.all(urls.slice(index, index + 4).map(async url => {
    const response = await request(url);
    assert.equal(response.status, 200, url);
    const html = await response.text();
    assert.match(html, /lang="fa-IR"/, url);
    assert.match(html, /حسین مختاری/, url);
    assert.doesNotMatch(html, /href="(?:https:\/\/hosseinmokhtari\.ir)?\/(?:posts|tags|archives|search)(?:\/|"|\?)/, url);
    assert.doesNotMatch(html, /application\/rss\+xml/, url);
  }));
}

const hidden = ["/posts", "/posts/", "/posts/resumable-python-crawler/", "/tags/", "/archives/", "/search/", "/rss.xml", "/.git/config", "/.htaccess"];
for (const path of hidden) {
  assert.equal((await request(path)).status, 404, path);
}

for (const url of ["http://hosseinmokhtari.ir/", "http://www.hosseinmokhtari.ir/", "https://www.hosseinmokhtari.ir/"]) {
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 301, url);
  assert.equal(response.headers.get("location"), `${origin}/`, url);
}

const homepage = await request("/").then(response => response.text());
const assets = [...new Set([...homepage.matchAll(/(?:src|href)="(\/_astro\/[^"\s]+)"/g)].map(match => match[1]))];
assert(assets.length > 0, "Expected built assets on homepage");
for (const path of assets) assert.equal((await request(path)).status, 200, path);
process.stdout.write(`Live checks passed: ${urls.length} pages, ${hidden.length} hidden paths, 3 redirects, ${assets.length} assets.\n`);
