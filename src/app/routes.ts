import { createBrowserRouter } from "react-router";
import LandingPage from "./components/LandingPage";
import LandingPageV2 from "./components/LandingPageV2";
import FormPage from "./components/FormPage";
import ThankYouPage from "./components/ThankYouPage";
import FailedPaymentPage from "./components/FailedPaymentPage";
import PrivacyPage from "./components/PrivacyPage";
import OfertaPage from "./components/OfertaPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/v2", Component: LandingPageV2 },
  { path: "/green", Component: LandingPageV2 },
  { path: "/form", Component: FormPage },
  { path: "/t3nx-8291", Component: ThankYouPage },
  { path: "/failed-payment", Component: FailedPaymentPage },
  { path: "/privacy", Component: PrivacyPage },
  { path: "/oferta", Component: OfertaPage },
]);
