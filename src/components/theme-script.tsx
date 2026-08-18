// Ustawia motyw PRZED pierwszym malowaniem strony (inline, blokujące),
// żeby uniknąć błysku złego motywu przy odświeżeniu. Osobny plik, bo
// next/script "beforeInteractive" wymaga własnego komponentu.
const THEME_INIT = `
(function () {
  try {
    var saved = localStorage.getItem("kf-theme");
    var theme = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />;
}
