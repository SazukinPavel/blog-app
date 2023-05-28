import React from 'react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {store} from "./store";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Posts from "./views/Posts";
import Register from "./views/Register";
import Login from "./views/Login";
import * as ReactDOMClient from "react-dom/client";


const rootElement = document.getElementById("root") as HTMLElement
const root = ReactDOMClient.createRoot(rootElement);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path='' Component={App}>
                    <Route Component={Posts} path="/">
                    </Route>
                    <Route Component={Register} path="/register"/>
                    <Route Component={Login} path="/login"/>
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>,
);
reportWebVitals();
