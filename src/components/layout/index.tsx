import Navbar from "@/components/Navbar";

type PropsLayout = {
  children: React.ReactNode;
  metaTitle?: string;
  metaDescription?: string;
};

export default function Layout({ children }: PropsLayout) {
  return (
    <>
      <Navbar />
      <main className='px-10 pb-20 sm:px-20 md:px-40 bg-[#F8FAFC]'>
        {children}
      </main>
    </>
  );
}