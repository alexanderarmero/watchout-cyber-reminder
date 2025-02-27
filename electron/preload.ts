
// Preload script using ES modules
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  // Example of accessing Node.js process versions in the renderer
  const versions: Record<string, string> = {}
  for (const dependency of ['chrome', 'node', 'electron']) {
    // @ts-ignore - Electron exposes these on the process object
    versions[dependency] = process.versions[dependency] || 'not available'
  }
  
  console.log('Process versions:', versions)
});
