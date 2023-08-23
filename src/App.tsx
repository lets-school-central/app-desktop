import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "$/components/Layout";
import Dashboard from "$/routes/dashboard";
import Login from "$/routes/login";
import ModInitialization from "$/routes/mod-initialization";
import { ModsList } from "$/routes/mods-list";
import { useUserStore } from "$/stores/userStore";

import { ModView } from "./routes/mod-view";

export default function App() {
	const initialized = useUserStore(state => state.initialized);

	if (!initialized) {
		return <Layout>Initializing...</Layout>;
	}

	return <BrowserRouter>
		<Layout>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/login" element={<Login />} />
				<Route path="/mod-initialization" element={<ModInitialization />} />
				<Route path="/mods-list" element={<ModsList />} />
				<Route path="/mod-view/:id" element={<ModView />} />
				<Route path="*" element={<div>404</div>} />
			</Routes>
		</Layout>
	</BrowserRouter>;
}
