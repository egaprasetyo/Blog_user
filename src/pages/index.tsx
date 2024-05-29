import Post from "@/components/Post";
import dynamic from "next/dynamic";
const LayoutComponent = dynamic(() => import("@/components/layout"));

export default function Home() {
  return (
    <LayoutComponent
      metaTitle="Home - Blog"
      metaDescription="This is blog post"
    >
      <Post />
    </LayoutComponent>
  );
}
