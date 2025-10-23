// app/layout.jsx
import "../styles/globals.css";


export const metadata = {
  title: "Warren Partridge Team — Berkshire Hathaway HomeServices Kee Realty",
  description: "Real estate relocation & referrals. Proudly affiliated with Berkshire Hathaway HomeServices Kee Realty.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* === Compliant Header (Brokerage must be equal or larger) === */}
        <header className="w-full bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Brokerage (>= team size) */}
            <div className="text-[18px] sm:text-xl font-bold text-gray-900">
              Berkshire Hathaway HomeServices Kee Realty
            </div>
            {/* Team (secondary) */}
            <div className="text-sm sm:text-base text-gray-700">
               Warren &amp; Partridge Team
            </div>  
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
