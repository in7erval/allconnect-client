import {createContext} from 'react';
import App from './App';
import {createRoot} from "react-dom/client";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import Store from "./store/store";
import StorePosts from "./store/storePosts";
import StoreModalImage from "./store/storeModal";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews} from "./dev/previews";
import {useInitial} from "./dev/hook";
import StoreTheme from "./store/storeTheme";

const store = new Store();
const storeModalImage = new StoreModalImage();
const storePosts = new StorePosts();
const storeTheme = new StoreTheme();

export const Context = createContext({store, storeModalImage, storePosts, storeTheme});

const container = document.querySelector('#app');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const root = createRoot(container);

root.render(
    <Context.Provider value={{
        store, storeModalImage, storePosts, storeTheme
    }}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*// @ts-ignore*/}
        <DevSupport ComponentPreviews={<ComponentPreviews/>}
                    useInitialHook={useInitial}
        >
            <App/>
        </DevSupport>
    </Context.Provider>
);

serviceWorkerRegistration.register();

reportWebVitals(console.log);
