import { axiosInstance } from "@/lib/axios/client";
import { Home } from "@/types/home";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

export const useController = () => {
  const router = useRouter();
  const [data, setData] = useState<Partial<Home>>({});
  const [search, setSearch] = useState("Jakarta")

  useEffect(() => {
    axiosInstance(`/api/${search}`, {
      params: router.query,
    }).then((value) => {
      setData(value.data);
    }).catch((e) =>{
      console.log(e);
    })
  }, [router.query, search]);

  return{
    data,
    setSearch
  }
}