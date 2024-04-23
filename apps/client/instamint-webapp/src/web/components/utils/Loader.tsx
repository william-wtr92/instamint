import Image from "next/image"
import React from "react"

const Loader = () => {
  return (
    // <div className="from-accent-200 via-accent-500 to-accent-800 aspect-square h-16 w-16 animate-spin rounded-full bg-gradient-to-bl p-1 drop-shadow-2xl md:h-32 md:w-32">
    //   <div className="background-blur-md h-full w-full rounded-full bg-white"></div>
    // </div>
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="border-t-accent-500 flex h-14 w-14 animate-spin items-center justify-center rounded-full border-4 border-gray-300 text-4xl text-blue-400">
        <Image
          alt="Instamint logo"
          src={"/favicon.ico"}
          width={10}
          height={10}
          className="xs:block hover:animate-shake mx-auto animate-ping  lg:hidden"
        />
      </div>
    </div>
  )
}

export default Loader
