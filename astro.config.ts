import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

const pagefindDevPlugin = {
  name: "serve-pagefind-in-development",
  configureServer(server: { middlewares: { use: Function } }) {
    const pagefindRoot = resolve("dist/pagefind");
    const contentTypes: Record<string, string> = {
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".pf_index": "application/octet-stream",
      ".pf_meta": "application/octet-stream",
      ".pf_fragment": "application/octet-stream",
      ".wasm": "application/wasm",
    };

    server.middlewares.use(
      (request: { url?: string }, response: any, next: Function) => {
        const pathname = new URL(request.url ?? "/", "http://localhost")
          .pathname;
        if (!pathname.startsWith("/pagefind/")) {
          next();
          return;
        }

        const requestedPath = decodeURIComponent(pathname)
          .replace(/^\/pagefind\/?/, "")
          .replace(/^\/+/, "");
        const filePath = resolve(pagefindRoot, requestedPath);

        if (
          !filePath.startsWith(`${pagefindRoot}\\`) ||
          !existsSync(filePath) ||
          !statSync(filePath).isFile()
        ) {
          next();
          return;
        }

        response.setHeader(
          "Content-Type",
          contentTypes[extname(filePath)] ?? "application/octet-stream"
        );
        createReadStream(filePath).pipe(response);
      }
    );
  },
};

export default defineConfig({
  site: config.site.url,
  integrations: [
    {
      name: "optional-blog",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          if (config.features?.blog === false) return;
          const routes = [
            ["/posts/[...page]", "posts/[...page].astro"],
            ["/posts/[...slug]", "posts/[...slug]/index.astro"],
            ["/posts/[...slug]/index.png", "posts/[...slug]/index.png.ts"],
            ["/tags", "tags/index.astro"],
            ["/tags/[tag]/[...page]", "tags/[tag]/[...page].astro"],
            ["/archives", "archives/index.astro"],
            ["/search", "search.astro"],
            ["/rss.xml", "rss.xml.ts"],
          ];
          for (const [pattern, entrypoint] of routes) {
            injectRoute({
              pattern,
              entrypoint: `./src/blog/pages/${entrypoint}`,
            });
          }
        },
      },
    },
    mdx(),
    sitemap({
      filter: page => {
        const pathname = new URL(page).pathname;
        return !["/404.html", "/search/", "/tags/"].some(
          path => pathname === path || pathname.startsWith(path)
        );
      },
    }),
  ],
  i18n: {
    locales: ["fa"],
    defaultLocale: "fa",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss(), pagefindDevPlugin],
  },
  fonts: [
    {
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
