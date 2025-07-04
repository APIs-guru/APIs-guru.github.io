import { Geist, Geist_Mono, Roboto } from "next/font/google";

import Support from "@/components/Support";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
        <Support />
        {children}
     
       
        </>
  );
}
