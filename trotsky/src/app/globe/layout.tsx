import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

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
  return (<>

        <Header />
        {children}
        <Footer />
        </>

  );
}
