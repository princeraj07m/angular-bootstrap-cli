# Angular Bootstrap CLI

A simple custom CLI tool to **create Angular projects with Bootstrap**.
It saves time by automating the installation and setup process.

---

## 📥 Installation

Install globally from npm:

```bash
npm install -g angular-bootstrap-cli
```

---

## 🚀 Usage

To create a new Angular project, run:

```bash
ng-b-fa-new my-app
```

This will:

* Create a new Angular app (`ng new my-app`)
* Install **Bootstrap**, **FontAwesome**
* Automatically configure `angular.json` with required CSS

---

## 📂 After Installation

Your project will already have:

* ✅ Bootstrap grid, utilities, and components
* ✅ FontAwesome icons

No extra setup needed — just start coding.

---

## 🖥 Example

```bash
# Create new project
ng-b-fa-new shop-app

# Move into project
cd shop-app

# Start dev server
ng serve -o
```

Open **[http://localhost:4200](http://localhost:4200)** to see your app running.

---

## 🧪 Quick Test

Inside `app.component.html`, replace the template with:

```html
<div class="container text-center mt-5">
  <h1 class="text-primary">
    🚀 Angular Bootstrap CLI Works!
  </h1>
  <button class="btn btn-success mt-3">
    <i class="fa fa-check"></i> Bootstrap + FA
  </button>
</div>
```

If you see a styled heading, a green Bootstrap button with an icon — 🎉 setup is working!

---

## 📄 License

[MIT](LICENSE) © [Prince Kumar](https://github.com/princeraj07m)
