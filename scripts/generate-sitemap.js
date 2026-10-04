const fs = require("fs");
const path = require("path");

const BASE_URL = "https://konstantinedatunishvili.com";

const routesMap = new Map();

// * Predefined static routes

routesMap.set("/", {
  priority: 1.0,
  changefreq: "weekly",
});

routesMap.set("/assets/files/resume.pdf", {
  priority: 0.9,
  changefreq: "weekly",
});

routesMap.set("/blog", {
  priority: 0.9,
  changefreq: "weekly",
});

routesMap.set("/archive", {
  priority: 0.8,
  changefreq: "weekly",
});

routesMap.set("/qr-project", {
  priority: 0.7,
  changefreq: "yearly",
  lastMod: "2024-08-04",
});

function fillArticlesRoutes() {
  const articlesDir = path.join(__dirname, "..", "src", "blog");
  const articleFiles = fs.readdirSync(articlesDir);
  let newestArticle = "";

  for (const file of articleFiles) {
    if (path.extname(file) === ".md") {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const match = fileContent.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
      const lastMod = match ? match[1] : "";
      const route = `/blog/${path.basename(file, ".md")}/`;
      routesMap.set(route, {
        lastMod,
        priority: 0.8,
        changefreq: "weekly",
      });
      if (lastMod > newestArticle) {
        newestArticle = lastMod;
      }
    }
  }

  return newestArticle;
}

async function main() {
  const newestArticle = fillArticlesRoutes();
  routesMap.get("/blog").lastMod = newestArticle;

  let content = "";
  for (const [route, info] of routesMap) {
    const lastMod = info.lastMod ? `<lastmod>${info.lastMod}</lastmod>` : "";
    content += `<url><loc>${BASE_URL}${route}</loc>${lastMod}<changefreq>${info.changefreq}</changefreq><priority>${info.priority}</priority></url>`;
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${content}</urlset>`;
  fs.writeFileSync(path.join(__dirname, "..", "src", "sitemap.xml"), sitemap);
}

main();
