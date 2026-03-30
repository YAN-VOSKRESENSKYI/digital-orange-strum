
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  import { initPixels } from "./app/pixel-config";

initPixels();

createRoot(document.getElementById("root")!).render(<App />);
  