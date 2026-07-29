import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import About from "./pages/About";
// import Services from "./pages/Services";
import WebsiteDesigning from "./pages/Services/WebsiteDesigning";
import CRMDevelopment from "./pages/Services/CRMDevelopment";
import AppDevelopment from "./pages/Services/AppDevelopment";
import CloudManagement from "./pages/Services/CloudManagement";
import DatabaseManagement from "./pages/Services/DatabaseManagement";
import AWSServices from "./pages/Services/AWSServices";

import WhyChooseUs from "./pages/WhyChooseUs";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import RefundPolicy from "./pages/RefundPolicy";
import TermsService from "./pages/TermsService";
import PrivacyPolicy from "./pages/PrivacyPolicy"
import Success from "./Components/Success"
import Vendors from "./pages/dashboard/Vendors";
import { LogIn } from "lucide-react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


import Dashboard from "./pages/dashboard/Dashboard";
import VendorsList from "./pages/dashboard/VendorsList";
import FollowUps from "./pages/dashboard/FollowUps";
import Renewals from "./pages/dashboard/Renewals";
import RenewalsCancelled from "./pages/dashboard/RenewalsCancelled";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";
import Admin from "./pages/dashboard/admin/Admin"
import UserDetails from "./pages/dashboard/admin/UserDetails"
import Deals from "./pages/dashboard/Deals";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Services */}
        {/* <Route path="/services" element={<Services />} /> */}
        <Route path="/Services/website-designing" element={<WebsiteDesigning />} />
        <Route path="/Services/crm-development" element={<CRMDevelopment />} />
        <Route path="/Services/Application-Development" element={<AppDevelopment />} />
        <Route path="/Services/cloud-management" element={<CloudManagement />} />
        <Route path="/Services/database-management" element={<DatabaseManagement />} />
        <Route path="/Services/aws-services" element={<AWSServices />} />

        <Route path="/why-choose-us" element={<WhyChooseUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<Success />} />
       
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />

        {/* Dashbaord */}
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/vendors" element={<Vendors />} />
         <Route path="/vendors-list" element={<VendorsList />} />
         <Route path="/deals" element={<Deals />} />
         <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users/:id" element={<UserDetails />} />
        <Route path="/follow-ups" element={<FollowUps />} />
        <Route path="/renewals" element={<Renewals />} />
        <Route path="/renewals-cancelled" element={<RenewalsCancelled />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  ); 
}

export default App;