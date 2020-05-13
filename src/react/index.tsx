import React from "react";
import { unstable_createRoot } from "react-dom";
import {} from "react-dom/experimental";
import { App } from "./App";

unstable_createRoot(
  document.getElementById("react-root")!
).render(<App />);
