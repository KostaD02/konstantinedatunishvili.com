const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const BASE_URL = "https://konstantinedatunishvili.com";
const REPO_DIR = path.join(__dirname, "..");
const SRC_DIR = path.join(REPO_DIR, "src");
const GIT_OPTIONS = { cwd: REPO_DIR, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] };

const routesMap = new Map();

// ! A shallow clone dates every file to HEAD, so lastmod is dropped rather than stamped with the deploy date
const hasFullHistory = (() => {
  try {
    return execFileSync("git", ["rev-parse", "--is-shallow-repository"], GIT_OPTIONS).trim() === "false";
  } catch {
    return false;
  }
})();

// * Newest git commit date of the given source files, "" when it cannot be derived
function lastCommitDate(files) {
  let newest = "";

  if (!hasFullHistory) {
    return newest;
  }

  for (const file of files) {
    try {
      const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], GIT_OPTIONS).trim();

      if (date > newest) {
        newest = date;
      }
    } catch {
      // ? No git history available, the field is omitted rather than faked
    }
  }

  return newest;
}

// * Predefined static routes

routesMap.set("/", {
  priority: 1.0,
  lastMod: lastCommitDate([
    path.join(SRC_DIR, "index.njk"),
    path.join(SRC_DIR, "_data", "consts.json"),
    path.join(SRC_DIR, "_data", "experiences.json"),
    path.join(SRC_DIR, "_data", "projects.json"),
    path.join(SRC_DIR, "_data", "skills.json"),
    path.join(SRC_DIR, "_data", "urls.json"),
    path.join(SRC_DIR, "_data", "works.json"),
  ]),
});

routesMap.set("/assets/files/resume.pdf", {
  priority: 0.7,
  lastMod: lastCommitDate([path.join(SRC_DIR, "assets", "files", "resume.pdf")]),
});

routesMap.set("/blog", {
  priority: 0.9,
});

routesMap.set("/archive", {
  priority: 0.8,
  lastMod: lastCommitDate([
    path.join(SRC_DIR, "archive.njk"),
    path.join(SRC_DIR, "_data", "projects.json"),
  ]),
});

routesMap.set("/qr-project", {
  priority: 0.7,
  lastMod: "2024-08-04",
});

function fillArticlesRoutes() {
  const articlesDir = path.join(SRC_DIR, "blog");
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
    content += `<url><loc>${BASE_URL}${route}</loc>${lastMod}<priority>${info.priority}</priority></url>`;
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${content}</urlset>`;
  fs.writeFileSync(path.join(SRC_DIR, "sitemap.xml"), sitemap);
}

main();
