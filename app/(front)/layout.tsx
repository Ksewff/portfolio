import Navbar from "@/components/front/Navbar";
import Footer from "@/components/front/Footer";

export default function FrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
