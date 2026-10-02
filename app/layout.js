import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2eee8' },
    { media: '(prefers-color-scheme: dark)', color: '#10100f' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export const metadata = {
  title: 'Team Random | FYDP Workspace',
  description: 'Academic team portal and project workspace for Team Random (UIU CSE)',
  applicationName: 'Team Random',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Team Random'
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/team-logo.png',
    apple: '/team-logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('team-random-theme');
                  if (saved === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={plusJakarta.className}>{children}</body>
    </html>
  );
}
