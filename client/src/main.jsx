import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import reduxStore from "./features/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <App />
    </Provider>
  </StrictMode>
);
