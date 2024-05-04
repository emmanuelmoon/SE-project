import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "./redux/store";

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Provider>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
