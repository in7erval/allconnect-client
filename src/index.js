import {createContext} from 'react';
import App from './App';
import {createRoot} from "react-dom/client";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import Store from "./store/store";
import StorePosts from "./store/storePosts";
import StoreModalImage from "./store/storeModal";

const store = new Store();
const storeModalImage = new StoreModalImage();
const storePosts = new StorePosts();

export const Context = createContext({store, storeModalImage, storePosts});

const container = document.querySelector('#app');
const root = createRoot(container);
root.render(
	<Context.Provider value={{
		store, storeModalImage, storePosts
	}}>
		<App/>
	</Context.Provider>
);

serviceWorkerRegistration.register();

reportWebVitals(console.log);
