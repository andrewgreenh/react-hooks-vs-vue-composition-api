import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { getInfo } from "../server/apiClient";

function Input() {
  return <input placeholder="input"></input>;
}

function Button() {
  return <button>click</button>;
}

function App() {
  const [Component, setComponent] = useState(() => Input);

  useEffect(() => {
    getInfo("pikachu").then(console.log);
    setTimeout(() => {
      setComponent(() => Button);
    }, 5000);
  }, []);

  return (
    <div>
      <Component />
    </div>
  );
}

render(<App />, document.getElementById("react-root"));
