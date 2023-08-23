import * as React from "react";

import * as ReactDOM from "react-dom/client";

import Layout from "$/components/Layout";

import App from "./App";

import "./index.css";
import "./i18n/config";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
