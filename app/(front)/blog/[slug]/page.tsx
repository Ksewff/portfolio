import type { Metadata } from "next";
import BlogArticle from "@/components/front/BlogArticle";

export const metadata: Metadata = {
  title: "日志详情",
};

export default function BlogDetailPage() {
  return <BlogArticle />;
}
