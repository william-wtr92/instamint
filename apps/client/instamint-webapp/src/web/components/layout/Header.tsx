import React from "react"

import UserInfo from "../utils/UserInfo"

const Header = () => {
  return (
    <div className="border-accent-950 xs:w-[25%] xs:h-full h-[8%] w-full bg-neutral-50 shadow-[0_2px_5px_0_#00000040]">
      <UserInfo />
    </div>
  )
}

export default Header