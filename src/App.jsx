import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import About from "./pages/About";
// import Services from "./pages/Services";
import WebsiteDesigning from "./pages/services/WebsiteDesigning";
import CRMDevelopment from "./pages/services/CRMDevelopment";
import AppDevelopment from "./pages/services/AppDevelopment";
import CloudManagement from "./pages/services/CloudManagement";
import DatabaseManagement from "./pages/services/DatabaseManagement";
import AWSServices from "./pages/services/AWSServices";

import WhyChooseUs from "./pages/WhyChooseUs";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import RefundPolicy from "./pages/RefundPolicy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Services */}
        {/* <Route path="/services" element={<Services />} /> */}
        <Route path="/services/website-designing" element={<WebsiteDesigning />} />
        <Route path="/services/crm-development" element={<CRMDevelopment />} />
        <Route path="/services/Application-Development" element={<AppDevelopment />} />
        <Route path="/services/cloud-management" element={<CloudManagement />} />
        <Route path="/services/database-management" element={<DatabaseManagement />} />
        <Route path="/services/aws-services" element={<AWSServices />} />

        <Route path="/why-choose-us" element={<WhyChooseUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  ); 
}

export default App;
