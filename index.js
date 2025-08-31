#!/usr/bin/env node

// Set environment variables to prevent issues
process.env.NG_CLI_ANALYTICS = "false";
process.env.NODE_OPTIONS = "--max-old-space-size=4096";

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Enhanced command runner with Windows fixes
function run(command) {
  console.log(`\n> ${command}`);
  
  const options = {
    stdio: "inherit",
    env: {
      ...process.env,
      NG_CLI_ANALYTICS: "false",
      NODE_OPTIONS: "--max-old-space-size=4096"
    }
  };

  if (process.platform === "win32") {
    options.shell = true;
    options.windowsHide = true;
  }

  try {
    execSync(command, options);
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Alternative spawn function for npm commands (Windows compatibility)
function runNpm(args) {
  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    
    console.log(`\n> ${npmCmd} ${args.join(" ")}`);
    
    const child = spawn(npmCmd, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: {
        ...process.env,
        NG_CLI_ANALYTICS: "false"
      }
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`npm process exited with code ${code}`));
      } else {
        resolve();
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: ng-b-fa-new <project-name> [--no-standalone]");
    process.exit(1);
  }

  const projectName = String(args[0]).trim();
  const flags = args.slice(1);

  if (!projectName || projectName === "undefined" || projectName === "null") {
    console.error("❌ Invalid project name provided");
    console.log("Usage: ng-b-fa-new <project-name> [--no-standalone]");
    process.exit(1);
  }

  console.log(`\n🚀 Creating Angular project: ${projectName}\n`);

  try {
    const originalDir = process.cwd();

    // Build Angular CLI command
    let ngCommand = `npx --yes @angular/cli@latest new ${projectName} --style=scss --routing --skip-install --ssr=false --defaults --skip-git`;

    if (flags.includes("--no-standalone")) {
      ngCommand += " --standalone=false";
      console.log("⚙️  Standalone disabled (using modules)");
    }

    // 1️⃣ Create Angular project
    console.log("📦 Creating Angular project...");
    run(ngCommand);

    // 2️⃣ Navigate to project directory
    const projectPath = path.join(originalDir, projectName);
    console.log(`📁 Entering project directory: ${projectName}`);
    
    if (!fs.existsSync(projectPath)) {
      throw new Error(`Project directory ${projectPath} was not created successfully`);
    }
    
    process.chdir(projectPath);
    console.log(`✅ Changed to directory: ${process.cwd()}`);

    // 3️⃣ Disable analytics
    console.log("🚫 Disabling Angular analytics...");
    run("npx ng analytics off");

    // 4️⃣ Install dependencies
    console.log("📦 Installing base dependencies...");
    await runNpm(["install"]);

    console.log("🎨 Installing Bootstrap and FontAwesome...");
    await runNpm(["install", "bootstrap", "@fortawesome/fontawesome-free"]);

    // 5️⃣ Remove zone.js
    console.log("🗑️ Removing zone.js for zoneless Angular...");
    await runNpm(["uninstall", "zone.js"]);

    const polyfillsPath = "src/polyfills.ts";
    if (fs.existsSync(polyfillsPath)) {
      let polyfills = fs.readFileSync(polyfillsPath, "utf8");
      polyfills = polyfills.replace(/import 'zone\.js.*?;/g, "// zone.js removed for zoneless Angular");
      fs.writeFileSync(polyfillsPath, polyfills);
      console.log("✅ Updated polyfills.ts");
    }

    // 6️⃣ Update angular.json
    console.log("⚙️ Configuring angular.json with Bootstrap & FontAwesome...");
    const angularJsonPath = "angular.json";
    
    if (!fs.existsSync(angularJsonPath)) {
      throw new Error("angular.json not found in project directory");
    }
    
    const angularJson = JSON.parse(fs.readFileSync(angularJsonPath, "utf8"));
    const buildOptions = angularJson.projects[projectName].architect.build.options;
    
    if (!buildOptions.styles.some(style => style.includes("bootstrap"))) {
      buildOptions.styles.push("node_modules/bootstrap/dist/css/bootstrap.min.css");
    }
    if (!buildOptions.styles.some(style => style.includes("fontawesome"))) {
      buildOptions.styles.push("node_modules/@fortawesome/fontawesome-free/css/all.min.css");
    }
    
    fs.writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2));
    console.log("✅ Updated angular.json");

    // 7️⃣ Custom app template
    console.log("🎨 Creating custom app template...");
    const appHtmlPath = path.join("src", "app", "app.html");
    
    if (!fs.existsSync(path.dirname(appHtmlPath))) {
      fs.mkdirSync(path.dirname(appHtmlPath), { recursive: true });
    }
    
    const customHtml = `
<body>
  <div class="wrapper">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">🚀 Angular Bootstrap CLI</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="https://www.npmjs.com/package/ng-b-fa-new">Docs</a></li>
            <li class="nav-item"><a class="nav-link" href="https://github.com/princeraj07m" target="_blank">GitHub</a></li>
            <li class="nav-item"><a class="nav-link" href="https://instagram.com/princeraj07m" target="_blank">Instagram</a></li>
            <li class="nav-item"><a class="nav-link" href="https://linkedin.com/in/princeraj07m" target="_blank">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <header class="hero text-center py-5">
        <div class="container">
          <h1 class="display-4 fw-bold typewriter">Welcome to Angular Bootstrap Project</h1>
          <p class="lead">A powerful CLI tool to create Angular projects with Bootstrap and FontAwesome.</p>
          <a href="https://www.npmjs.com/package/ng-b-fa-new" class="btn btn-primary btn-lg px-4 mt-3">Get Started</a>
        </div>
      </header>

      <section class="features py-5 my-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-md-4">
              <div class="card text-center shadow-sm border-0 h-100">
                <div class="card-body">
                  <i class="fas fa-bolt fa-3x text-primary mb-3"></i>
                  <h5 class="card-title">Quick Setup</h5>
                  <p class="card-text">Generate an Angular project with Bootstrap and FontAwesome in seconds.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card text-center shadow-sm border-0 h-100">
                <div class="card-body">
                  <i class="fas fa-paint-brush fa-3x text-primary mb-3"></i>
                  <h5 class="card-title">Styled Components</h5>
                  <p class="card-text">Includes Bootstrap grids, utilities, and FontAwesome icons out of the box.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card text-center shadow-sm border-0 h-100">
                <div class="card-body">
                  <i class="fas fa-box-open fa-3x text-primary mb-3"></i>
                  <h5 class="card-title">Ready to Use</h5>
                  <p class="card-text">Start coding your Angular project immediately with no extra setup required.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-dark text-light py-4">
      <div class="container text-center">
        <p class="mb-2">Made with ❤️ by Prince</p>
        <div>
          <a href="https://github.com/princeraj07m" target="_blank" class="text-light mx-2"><i class="fab fa-github"></i></a>
          <a href="https://instagram.com/princeraj07m" target="_blank" class="text-light mx-2"><i class="fab fa-instagram"></i></a>
          <a href="https://linkedin.com/in/princeraj07m" target="_blank" class="text-light mx-2"><i class="fab fa-linkedin"></i></a>
        </div>
        <p class="mt-2 mb-0 small">&copy; 2025 Angular Bootstrap CLI. All rights reserved.</p>
      </div>
    </footer>
  </div>
</body>

<style>
    /* Global Styles */
body, html {
  height: 100%;
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
}

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* Navbar */
.navbar {
  padding: 1.5rem 1rem;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 100px 20px;
}

.hero .lead {
  color: rgba(255, 255, 255, 0.8);
}

/* Typewriter Effect */
.typewriter {
  display: inline-block;
  overflow: hidden;
  border-right: 3px solid #fff;
  white-space: nowrap;
  animation: typing 4s steps(40, end), blink .75s step-end infinite;
  font-size: 2.5rem;
  font-weight: bold;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink {
  from, to { border-color: transparent }
  50% { border-color: #fff; }
}

/* Features Section */
.features .card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 15px;
}

.features .card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.features .card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>`;
    
    fs.writeFileSync(appHtmlPath, customHtml);
    console.log("✅ Created custom app template");

    console.log("\n✅ Setup completed successfully!");
    console.log("🚀 Starting development server...\n");

    // 8️⃣ Start dev server
    run("npx ng serve --open");

  } catch (error) {
    console.error("\n❌ Setup failed:");
    console.error(error.message);

    console.error("\n🔍 Debug info:");
    console.error(`Current directory: ${process.cwd()}`);
    console.error(`Node version: ${process.version}`);
    console.error(`Platform: ${process.platform}`);
    
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
  process.exit(1);
});

// Run main
main().catch((error) => {
  console.error("Main function error:", error.message);
  process.exit(1);
});
