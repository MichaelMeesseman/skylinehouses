// app/disclaimer/page.jsx
export default function Disclaimer() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Disclaimer & Licensing</h1>
      <p className="mt-6 text-sm leading-6 text-gray-700">
        Skyline Houses is a real-estate referral and information service. We introduce consumers to licensed
        real-estate professionals through our sponsoring brokerage. Skyline Houses does not act as the listing
        broker or represent buyers/sellers directly.
      </p>
      <p className="mt-4 text-sm leading-6 text-gray-700">
        Broker sponsorship: <strong>Berkshire Hathaway HomeServices Kee Realty</strong>. MLS data provided by
        Realcomp II Ltd and participating MLSs. Information deemed reliable but not guaranteed and should be
        independently verified. © {new Date().getFullYear()} MLS and licensors. All rights reserved.
      </p>
      <p className="mt-4 text-sm leading-6 text-gray-700">
        For licensing or data requests, email{" "}
        <a className="underline" href="mailto:referrals@yourbrokerage.com">sarahfoy@keerealty.com</a>.
      </p>
    </main>
  );
}
