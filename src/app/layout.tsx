import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Import the provider
import { ThemeProvider } from "@/components/theme-provider"; // (Assuming you have this from shadcn)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Forge",
  description: "Generate chat, code, and images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrap everything in the AuthProvider */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}