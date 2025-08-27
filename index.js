#!/usr/bin/env node

// Minimal CLI for Angular + Bootstrap + FontAwesome + PrimeNG setup
const { execSync } = require("child_process");
const fs = require("fs");

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit" });
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: ng-b-fa-new <project-name>");
    process.exit(1);
  }

  const projectName = args[0];
  console.log(`\n🚀 Creating Angular project: ${projectName}\n`);

  // 1. Create Angular app
  run(`npx @angular/cli new ${projectName} --style=scss --routing --skip-install`);

  // 2. Move inside project
  process.chdir(projectName);

  // 3. Install dependencies
  run("npm install");
  run("npm install bootstrap @fortawesome/fontawesome-free primeng primeicons");

  // 4. Update angular.json
  const angularJson = JSON.parse(fs.readFileSync("angular.json", "utf8"));
  const buildOptions = angularJson.projects[projectName].architect.build.options;

  buildOptions.styles.push("node_modules/bootstrap/dist/css/bootstrap.min.css");
  buildOptions.styles.push("node_modules/@fortawesome/fontawesome-free/css/all.min.css");
  buildOptions.styles.push("node_modules/primeng/resources/themes/saga-blue/theme.css");
  buildOptions.styles.push("node_modules/primeng/resources/primeng.min.css");
  buildOptions.styles.push("node_modules/primeicons/primeicons.css");

  fs.writeFileSync("angular.json", JSON.stringify(angularJson, null, 2));

  console.log("\n✅ Setup complete! Run the following commands:");
  console.log(`\n   cd ${projectName}`);
  console.log("   ng serve\n");
}

main();
