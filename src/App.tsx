import './styles/App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AppRouter from "./router/AppRouter";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import PopupErrors from "./components/UI/Popup/PopupErrors";
import {useContext} from "react";
import {Context} from "./index";

const queryClient = new QueryClient()

function App() {
	const {storeTheme} = useContext(Context);
	storeTheme.initTheme();

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Navbar/>
				<AppRouter/>
				<PopupErrors/>
			</BrowserRouter>
			<ReactQueryDevtools/>
		</QueryClientProvider>
	)
}

export default App;
