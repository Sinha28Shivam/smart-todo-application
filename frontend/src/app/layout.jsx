import "./globals.css";
import Navbar from "../components/Navbar";
import AuthChecking from "../components/AuthChecking";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Consistent background matching your globals.css */}
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600">
          <Navbar /> 
          <AuthChecking>
            <div className="app-container">
              {children}
            </div>
          </AuthChecking>
        </div>
      </body>
    </html>
  );
}