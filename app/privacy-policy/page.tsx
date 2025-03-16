"use client"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

      <div className="max-w-4xl mx-auto prose prose-gray">
        <p className="text-gray-600 mb-8">
          Last updated: March 15, 2024
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            We respect your privacy and are committed to protecting your personal data. This privacy
            policy explains how we collect, use, and safeguard your information when you visit our
            website and make purchases.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and contact information</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Dental impressions and related measurements</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Automatically Collected Information</h3>
          <ul className="list-disc pl-6">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage data and cookies</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your order</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our products and services</li>
            <li>Detect and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
          <p className="mb-4">
            We share your information with:
          </p>
          <ul className="list-disc pl-6">
            <li>Payment processors to handle transactions</li>
            <li>Shipping partners to deliver your orders</li>
            <li>Service providers who assist our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from
            unauthorized access, alteration, disclosure, or destruction. However, no method of
            transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Withdraw consent for marketing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to improve your browsing experience,
            analyze site traffic, and understand where our visitors come from. You can control
            cookies through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13 years of age. We do not knowingly
            collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes
            by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our practices, please contact us at:
          </p>
          <div className="mt-4">
            <p>Email: privacy@veliano.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Address: 123 Main Street, Suite 100, City, State 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
} 
