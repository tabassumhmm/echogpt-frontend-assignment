const themeScript = `
(function () {
  try {
    var key = "echogpt-demo:v1:theme";
    var stored = window.localStorage.getItem(key);
    var mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode;
    document.documentElement.classList.toggle("dark", resolved === "dark");
  } catch (error) {
    document.documentElement.classList.remove("dark");
  }
})();
`;

export function ThemeScript() {
	return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
