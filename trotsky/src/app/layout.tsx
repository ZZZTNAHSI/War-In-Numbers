import "./globals.css";

export const metadata = {
  icons: {
    icon: "/icon.png",
  },
  title: "War in Numbers",
  description: "Explore global conflicts in this interactive map layout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
