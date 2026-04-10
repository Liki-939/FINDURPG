"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  return <div>Home Page</div>;
}