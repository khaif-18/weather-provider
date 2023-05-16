import { useController } from "@/dist/hooks"

export default function Home(){
  const data = useController();
  console.log(data.data.main);
  
  return(
    <>
      <div className="container max-w-full h-screen flex justify-center bg-gradient-to-t from-sky-400 to-blue-100">
        <div>
          <h1 className="text-9xl">Testing</h1>
          <h2>Ini Clouds {data.data?.clouds?.all}</h2>
          <h2>Ini Kecepatan angin {data.data?.wind?.speed}</h2>
          <h2>Ini Nama Kota {data.data?.name}</h2>
          <h2>Temperaturnya {data.data?.main?.temp} Celcius</h2>
        </div>
      </div>
    </>
  )
}