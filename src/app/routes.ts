import { createBrowserRouter } from "react-router";
import LandingPage from "./components/LandingPage";
import FormPage from "./components/FormPage";
import ThankYouPage from "./components/ThankYouPage";
import FailedPaymentPage from "./components/FailedPaymentPage";
import PrivacyPage from "./components/PrivacyPage";
import OfertaPage from "./components/OfertaPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/form", Component: FormPage },
  { path: "/t3nx-8291", Component: ThankYouPage },
  { path: "/failed-payment", Component: FailedPaymentPage },
  { path: "/privacy", Component: PrivacyPage },
  { path: "/oferta", Component: OfertaPage },
]);
