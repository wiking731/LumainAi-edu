import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: "Advo AI - Huquqiy Yordamchi | Правовой Помощник",
  description: "O'zbekistonning eng ilg'or raqamli huquqiy advokati. Shartnomalar tahlili, iste'molchi huquqlari himoyasi. Самый передовой цифровой юридический адвокат Узбекистана.",
  keywords: "huquqiy yordam, advokat, shartnoma tahlili, iste'molchi huquqi, Uzbekistan, O'zbekiston, юрист, права потребителей",
  authors: [{ name: "Advo AI" }],
  openGraph: {
    title: "Advo AI - Huquqiy Yordamchi",
    description: "O'zbekistonning eng ilg'or raqamli huquqiy advokati",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
