import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('=== main.tsx loaded ===');

try {
  const rootElement = document.getElementById("root");
  console.log('Root element:', rootElement);

  if (!rootElement) {
    console.error('ERROR: Root element not found!');
    document.body.innerHTML = '<h1 style="color: red; padding: 50px;">ERROR: Root element not found!</h1>';
  } else {
    console.log('Creating React root...');
    const root = createRoot(rootElement);
    console.log('Rendering App...');
    root.render(<App />);
    console.log('=== App rendered successfully ===');
  }
} catch (error) {
  console.error('=== CRITICAL ERROR ===');
  console.error('Error details:', error);
  document.body.innerHTML = `
    <div style="padding: 50px; background: #fee; color: red;">
      <h1>خطأ فادح!</h1>
      <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
      <pre>${error instanceof Error ? error.stack : ''}</pre>
    </div>
  `;
}
