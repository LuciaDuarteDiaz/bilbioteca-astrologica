import "./ui/global.css";
import { DM_Serif_Display } from "next/font/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={dmSerif.variable}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
// layout.tsx
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});
