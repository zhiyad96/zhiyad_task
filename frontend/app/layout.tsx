import "./globals.css";  // 🔥 ADD THIS
import { AuthProvider } from "./context/Authcontext";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}