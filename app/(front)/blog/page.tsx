import type { Metadata } from "next";
import BlogIndex from "@/components/front/BlogIndex";

export const metadata: Metadata = {
  title: "观测日志",
  description: "关于界面、工程与产品判断的记录。",
};

export default function BlogPage() {
  return <BlogIndex />;
}
