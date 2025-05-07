import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import Tour from "./Tour.jsx";
import App from "./App.jsx";
import store from "./store/index.js";
import { Provider } from "react-redux";
import "driver.js/dist/driver.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
