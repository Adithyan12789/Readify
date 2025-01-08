import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import "./index.css"; 

import { Provider } from 'react-redux';
import store from './Store';

// import { AdminRoutes, AdminLoginRoute } from './Routes/AdminRoutes';
import { UserRoutes } from './Routes/UserRoutes';
import ErrorBoundaryWrapper from './Components/UserComponents/ErrorBountary';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Admin Routes */}
      {/* {AdminRoutes}
      {AdminLoginRoute} */}

      {/* User Routes */}
      {UserRoutes}

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <ErrorBoundaryWrapper>
        <RouterProvider router={router} />
      </ErrorBoundaryWrapper>
    </React.StrictMode>
  </Provider>
);
