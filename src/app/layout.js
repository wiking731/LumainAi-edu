import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
    title: 'Advo AI - Huquqiy Yordamchi | Правовой Помощник',
    description: "O'zbekiston uchun AI-asosida huquqiy yordamchi. Huquqiy maslahat, shartnoma tahlili, imtiyozlar.",
    keywords: 'advokat, yurist, huquq, qonun, maslahatchisi, legal, lawyer, uzbekistan, AI',
    openGraph: {
        title: 'Advo AI - Huquqiy Yordamchi',
        description: "O'zbekiston uchun AI-asosida huquqiy yordamchi",
        type: 'website',
        locale: 'uz_UZ',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="uz" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('advoai-theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
                    }}
                />
            </head>
            <body>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
