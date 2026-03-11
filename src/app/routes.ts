import { createBrowserRouter } from "react-router";
import LandingPage from "./components/LandingPage";
import FormPage from "./components/FormPage";
import ThankYouPage from "./components/ThankYouPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/form", Component: FormPage },
  { path: "/t3nx-8291", Component: ThankYouPage },
]);
