const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const esbuild = require("esbuild");

const buildDir = path.join(__dirname, "../build/chrome");
const distDir = path.join(__dirname, "../dist");
const rootDir = path.join(__dirname, "..");

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

fs.copyFileSync(path.join(__dirname, "../manifest.chrome.json"), path.join(buildDir, "manifest.json"));

esbuild.buildSync({
    entryPoints: [path.join(__dirname, "../src/content.ts")],
    bundle: true,
    outfile: path.join(buildDir, "content.js"),
    platform: "browser",
    target: "chrome90",
    minify: false,
    sourcemap: false,
});

if (fs.existsSync(path.join(__dirname, "../icons"))) {
    const iconsDir = path.join(buildDir, "icons");
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }

    const iconFiles = fs.readdirSync(path.join(__dirname, "../icons")).filter((f) => f.endsWith(".png"));
    if (iconFiles.length > 0) {
        iconFiles.forEach((icon) => {
            fs.copyFileSync(path.join(__dirname, "../icons", icon), path.join(iconsDir, icon));
        });
    }

    // Ensure standard icon names exist (if only a single image was provided, copy it)
    const requiredIcons = ["icon16.png", "icon48.png", "icon128.png"];
    const existing = fs.readdirSync(iconsDir).filter((f) => f.endsWith(".png"));
    for (const name of requiredIcons) {
        if (!existing.includes(name)) {
            // prefer visibility_off.png or first available png
            const preferred = existing.includes("visibility_off.png") ? "visibility_off.png" : existing[0];
            if (preferred) {
                fs.copyFileSync(path.join(iconsDir, preferred), path.join(iconsDir, name));
            }
        }
    }
}

// remove any existing chrome-<version>.zip to ensure no leftover ZIP remains
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
    const version = packageJson.version;
    const zipName = `chrome-${version}.zip`;
    const zipPath = path.join(rootDir, "build", zipName);
    if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
        console.log(`Removed existing zip: build/${zipName}`);
    }
} catch (e) {
    // ignore errors here
}

console.log("Chrome build completed successfully! (no zip created)");
