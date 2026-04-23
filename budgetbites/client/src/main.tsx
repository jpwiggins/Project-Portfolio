import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Total Wellness on a Budget - Starting React App...");

// Add error handling for the entire app
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('Global error:', msg, 'at', url + ':' + lineNo + ':' + columnNo);
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif;"><h1>Total Wellness on a Budget</h1><p>Loading issue detected. Please refresh the page.</p></div>';
  throw new Error("Root element not found");
}

console.log("Root element found, creating React app...");

// Create visible test message
rootElement.innerHTML = `
  <div style="padding: 40px; text-align: center; background: #f0f0f0; min-height: 100vh; font-family: Arial, sans-serif;">
    <h1 style="color: #dc2626; font-size: 2rem; margin-bottom: 20px;">🚨 PREVIEW DEBUG MODE 🚨</h1>
    <p style="font-size: 1.2rem; margin-bottom: 20px;">If you can see this message, the preview is working</p>
    <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; border: 3px solid #dc2626;">
      <h2 style="color: #059669; margin-bottom: 16px;">Test Links:</h2>
      <p style="margin: 20px 0;"><a href="/test-preview" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">→ View Header Test</a></p>
      <p style="color: #6b7280; margin-top: 20px;">Click the button above to see your header design</p>
    </div>
    <p style="margin-top: 30px; color: #6b7280;">This is the main React loading page - timestamp: ${new Date().toLocaleTimeString()}</p>
  </div>
`;

console.log("Preview test page loaded at:", new Date().toLocaleTimeString());

try {
  createRoot(rootElement).render(<App />);
  console.log("React app rendered successfully!");
} catch (error) {
  console.error("Error rendering React app:", error);
  // Keep the fallback if React fails
}
