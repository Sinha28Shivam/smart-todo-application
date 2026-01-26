import "./globals.css";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Consistent background matching your globals.css */}
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600">
          <Navbar /> 
          <div className="app-container">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}