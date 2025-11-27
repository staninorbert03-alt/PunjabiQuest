/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: { extend: {} },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    # Node.js-Typen als Entwicklungsabhängigkeit installieren
npm install --save-dev @types/node
```
# Tailwind CSS und seine Peer-Abhängigkeiten installieren (zur Sicherheit)
npm install -D tailwindcss postcss autoprefixer

# Konfigurationsdateien erstellen
npx tailwindcss init -p
