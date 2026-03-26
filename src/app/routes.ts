import { createBrowserRouter } from "react-router";
import LandingPage from "./components/LandingPage";
import LandingPageGreen from "./components/LandingPageGreen";
import FormPage from "./components/FormPage";
import ThankYouPage from "./components/ThankYouPage";
import PrivacyPage from "./components/PrivacyPage";
import OfertaPage from "./components/OfertaPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/v2", Component: LandingPageGreen },
  { path: "/form", Component: FormPage },
  { path: "/t3nx-8291", Component: ThankYouPage },
  { path: "/privacy", Component: PrivacyPage },
  { path: "/oferta", Component: OfertaPage },
]);
