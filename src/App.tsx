import { Routes, Route } from "react-router-dom";
import routesConfig from "./routes/config.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
function App() {
  return (
    <Layout>

      <Routes>
        {routesConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute requiresClosed={route.requiresClosed || false}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Layout>

  );
}

export default App;
