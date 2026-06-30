import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./providers.jsx";
import { AppRoutes } from "./routes.jsx";

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}
