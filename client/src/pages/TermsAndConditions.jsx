// src/pages/TermsAndConditions.jsx
import React from "react";
import { FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Mark terms as accepted so the Register page checkbox stays checked
    localStorage.setItem("acceptedTerms", "true");
    navigate("/sign-up");
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 -right-20 w-72 h-72 bg-green-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-3xl mx-auto">
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Vendor Terms & Conditions
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Please read the terms below carefully
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
            <p>
              These Vendor Terms & Conditions ("Agreement") govern the
              relationship between "Abacco Technology" ("Company") and the
              Vendor/Referral Partner ("Vendor").
            </p>

            <Section title="1. Appointment">
              <p>
                The Vendor is appointed as a non-exclusive sales and referral
                partner to promote and market the Company's products and
                services.
              </p>
            </Section>

            <Section title="2. Commission Structure">
              <p className="font-medium text-gray-200">Initial Sale</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>
                  The Vendor will receive a commission equal to 20% of the
                  net sales value (excluding applicable taxes, refunds,
                  discounts, and transaction fees) for every successful sale
                  generated through the Vendor.
                </li>
                <li>
                  Commission becomes payable only after the Company has
                  received full payment from the customer.
                </li>
              </ul>
              <p className="font-medium text-gray-200 mt-3">
                Renewal Commission
              </p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>
                  The Vendor will receive 10% of the net renewal value for
                  every successful annual renewal made by the same customer
                  referred by the Vendor.
                </li>
                <li>
                  Renewal commissions are payable only after the renewal
                  payment has been received by the Company.
                </li>
              </ul>
            </Section>

            <Section title="3. Payment Terms">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Vendor commissions will be processed within 15–30 business
                  days after the customer payment has been successfully
                  received and verified.
                </li>
                <li>
                  Payments will be made via bank transfer or any other
                  mutually agreed payment method.
                </li>
                <li>
                  The Vendor is responsible for providing accurate payment
                  details.
                </li>
              </ul>
            </Section>

            <Section title="4. Eligible Sales">
              <p>Commission is payable only for:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Successfully completed sales.</li>
                <li>Sales where full payment has been received by the Company.</li>
                <li>Customers originally introduced by the Vendor.</li>
                <li>
                  Renewals completed while this agreement remains in effect
                  or as otherwise agreed by the Company.
                </li>
              </ul>
            </Section>

            <Section title="5. Non-Eligible Sales">
              <p>No commission will be paid for:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Cancelled or refunded orders.</li>
                <li>Fraudulent transactions.</li>
                <li>Internal purchases by the Vendor.</li>
                <li>
                  Existing customers already registered with the Company
                  before the Vendor's introduction (unless approved in
                  writing).
                </li>
              </ul>
            </Section>

            <Section title="6. Customer Ownership">
              <p>
                Customers introduced by the Vendor shall remain customers of
                the Company. The Company retains full ownership of all
                customer accounts, data, contracts, and billing
                relationships.
              </p>
            </Section>

            <Section title="7. Marketing Guidelines">
              <p>The Vendor agrees to:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Represent the Company's products and services accurately.</li>
                <li>Avoid making false, misleading, or unauthorized claims.</li>
                <li>
                  Comply with all applicable laws, regulations, and ethical
                  marketing practices.
                </li>
              </ul>
            </Section>

            <Section title="8. Confidentiality">
              <p>
                The Vendor shall keep confidential all pricing, customer
                information, business strategies, and proprietary
                information received from the Company and shall not disclose
                such information without prior written consent.
              </p>
            </Section>

            <Section title="9. Independent Contractor">
              <p>
                The Vendor acts as an independent contractor and is not an
                employee, partner, joint venture, or legal representative of
                the Company.
              </p>
            </Section>

            <Section title="10. Termination">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Either party may terminate this Agreement by providing 30
                  days' written notice.
                </li>
                <li>
                  Upon termination, commissions already earned prior to
                  termination will be paid according to these terms.
                </li>
                <li>
                  No commission will be payable on future sales or renewals
                  completed after the termination date unless otherwise
                  agreed in writing.
                </li>
              </ul>
            </Section>

            <Section title="11. Limitation of Liability">
              <p>
                The Company shall not be liable for indirect, incidental,
                special, or consequential damages arising from this
                Agreement.
              </p>
            </Section>

            <Section title="12. Governing Law">
              <p>
                This Agreement shall be governed by the laws of the
                jurisdiction in which the Company is incorporated.
              </p>
            </Section>

            <Section title="13. Amendments">
              <p>
                The Company reserves the right to amend these Terms &
                Conditions by providing written notice to the Vendor.
              </p>
            </Section>

            <Section title="14. Acceptance">
              <p>
                By participating in the Vendor Program, the Vendor confirms
                that they have read, understood, and agreed to these Terms &
                Conditions.
              </p>
            </Section>

            {/* Commission Summary Table */}
            <div>
              <p className="font-medium text-gray-200 mb-2">
                Commission Summary
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-800">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-800/60">
                      <th className="px-4 py-2.5 text-gray-300 font-medium">
                        Transaction
                      </th>
                      <th className="px-4 py-2.5 text-gray-300 font-medium">
                        Vendor Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-800">
                      <td className="px-4 py-2.5 text-gray-400">
                        First successful sale
                      </td>
                      <td className="px-4 py-2.5 text-gray-400">
                        20% of the net sales value
                      </td>
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="px-4 py-2.5 text-gray-400">
                        Customer renewal
                      </td>
                      <td className="px-4 py-2.5 text-gray-400">
                        10% of the net renewal value
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 mt-8"
          >
            Continue to Register
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-white font-semibold mb-1.5">{title}</h2>
      {children}
    </div>
  );
}