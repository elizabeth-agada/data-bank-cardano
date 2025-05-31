"use client";

import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/app/Landing"), { ssr: false });

export default function Client() {
  return <Home />;
}