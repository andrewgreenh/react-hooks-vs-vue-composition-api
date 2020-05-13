import React from "react";
import { unstable_createRoot } from "react-dom";
import {} from "react-dom/experimental";

function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

unstable_createRoot(
  document.getElementById("react-root")!
).render(<App />);
