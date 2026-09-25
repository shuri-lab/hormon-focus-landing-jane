import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import HormoneFocusLanding from "@/routes/index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HormoneFocusLanding />
  </StrictMode>,
);
