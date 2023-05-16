import { axiosInstance } from "@/lib/axios/client";
import { Home } from "@/types/home";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

export const useController = () => {
  const router = useRouter();
  const [data, setData] = useState<Partial<Home>>({});

  useEffect(() => {
    axiosInstance("/api/testing", {
      params: router.query,
    }).then((value) => {
      setData(value.data);
    });
  }, [router.query]);

  return{
    data
  }
}