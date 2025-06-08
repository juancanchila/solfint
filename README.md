# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


npm create vite@latest solfint -- --template react


New-Item -ItemType Directory -Path src\assets
New-Item -ItemType Directory -Path src\components
New-Item -ItemType Directory -Path src\services
New-Item -ItemType Directory -Path src\models
New-Item -ItemType Directory -Path src\utils
New-Item -ItemType Directory -Path src\config

New-Item -ItemType File -Path src\services\authService.js
New-Item -ItemType File -Path src\services\apiService.js
New-Item -ItemType File -Path src\models\userModel.js
New-Item -ItemType File -Path src\config\apiConfig.js
New-Item -ItemType File -Path src\config\routesConfig.js
New-Item -ItemType File -Path src\components\Login.js
New-Item -ItemType File -Path src/components/Login.css
New-Item -ItemType File -Path src\assets\styles\main.css
New-Item -ItemType File -Path src\assets\index.html
New-Item -ItemType File -Path src/components/SplashScreen.jsx
New-Item -ItemType File -Path src/components/SplashScreen.css

mkdir src/components/Error
New-Item -ItemType File -Path src/components/Error/Error.jsx
New-Item -ItemType File -Path src/components/Error/Error.css

mkdir src/components/Sidebar

mkdir src/components/Login

New-Item -ItemType File -Path src/components/Navbar/Navbar.jsx
New-Item -ItemType File -Path  src/components/Navbar/Navbar.css

mkdir src/components/Send-Code
New-Item -ItemType File -Path  src/components/Navbar/Send-Code.css
New-Item -ItemType File -Path  src/components/Navbar/Send-Code.jsx

## Start
npm run dev

mysql -u root -p
1q2w3e4r5tPD!!