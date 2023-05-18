import { useController } from "@/dist/hooks"
import { useEffect, useState } from "react";

export default function Home(){
  const {data, setSearch} = useController();
  const [dummy, setDummy] = useState("")

  const handleClick = (e: { preventDefault: () => void; }) => {    
    e.preventDefault();
    setSearch(dummy.replace(/\s/g, ""))
  };
  
  return(
    <>
        <div className="bg-blue-300 flex flex-col justify-center items-center h-[100vh]">
          <div className="flex items-center max-w-md mx-auto bg-white rounded-lg my-5">
            <input type="search" className="px-4 py-1 text-gray-800 rounded-full focus:outline-none" placeholder="search" value={dummy} onChange={(e) => setDummy(e.target.value)} />
            <button title="Btn" type="submit" className="flex items-center bg-blue-500 justify-center w-12 h-12 text-white rounded-r-lg" onClick={handleClick}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        
          <div className='!z-5 max-w-[378px] max-h-[368px] relative flex h-full w-full flex-col rounded-[20px] bg-white bg-clip-border p-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none'>
            <div className='mb-auto flex flex-col items-center justify-center'>
              <h4 className='mb-px mt-3 text-2xl font-bold text-navy-700 dark:text-black'>
                {data?.name}
              </h4>
              <p className='px-5 text-center text-base font-normal text-gray-600 md:!px-0 xl:!px-8'>
                {data.main?.temp}&deg;C
              </p>
              <p className='px-5 text-center text-base font-normal text-gray-600 md:!px-0 xl:!px-8'>
                Clouds {data?.clouds?.all}
              </p>
              <p className='px-5 text-center text-base font-normal text-gray-600 md:!px-0 xl:!px-8'>
                Wind Speed {data?.wind?.speed}
              </p>
            </div>
          </div>
        </div>
    </>
  )
}




