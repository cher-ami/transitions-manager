import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import { Router } from "@cher-ami/router";
import Home from "./pages/Home";
import Second from "./pages/Second";
import { createBrowserHistory } from "history";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router
    routes={[
      {
        path: "/",
        component: Home,
      },
      {
        path: "/second",
        component: Second,
      },
    ]}
    base={"/"}
    history={createBrowserHistory()}
  >
    <App />
  </Router>
);
