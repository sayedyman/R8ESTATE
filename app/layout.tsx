import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { getLocaleConfig } from "@/i18n/config";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "R8ESTATE | Professional Reputation for Real Estate Agents",
  description:
    "Build trust before your first client conversation with a verified professional profile, trust score, and identity verification.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const localeConfig = getLocaleConfig(locale as "en" | "ar");

  const fontVariable =
    localeConfig.dir === "rtl"
      ? `${tajawal.variable} ${inter.variable}`
      : inter.variable;

  return (
    <html
      lang={localeConfig.lang}
      dir={localeConfig.dir}
      className={`${fontVariable} h-full antialiased`}
    >
      <body
        className={`min-h-full flex flex-col h-full antialiased ${
          localeConfig.dir === "rtl" ? "font-arabic" : "font-sans"
        }`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProvider>{children}</SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
