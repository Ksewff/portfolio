import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteDataProvider } from "@/components/SiteDataProvider";
import StarField from "@/components/StarField";

export const metadata: Metadata = {
  title: {
    default: "林知远 · 产品工程师",
    template: "%s · 林知远",
  },
  description:
    "林知远的个人观测站：产品工程、界面设计与前端实践。一个关于代码、星空与克制的作品集。",
  keywords: ["个人主页", "作品集", "前端开发", "产品设计", "Next.js"],
};

export const viewport: Viewport = {
  themeColor: "#0B0F1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-space font-sans text-star antialiased">
        <SiteDataProvider>
          <StarField />
          <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
        </SiteDataProvider>
      </body>
    </html>
  );
}
