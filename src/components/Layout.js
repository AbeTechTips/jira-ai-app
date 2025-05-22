// components/Layout.js
import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
