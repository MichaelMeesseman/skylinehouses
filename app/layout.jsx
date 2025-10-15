import "../styles/globals.css";

export const metadata = {
  title: "Skyline Houses",
  description: "Trusted agents. Anywhere in the world.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
