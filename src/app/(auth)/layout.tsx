import { ReactNode } from "react";


export default function Authlayout({children}:{children:ReactNode}) {
  return (
    <div className="h-screen w-full justify-center items-center  flex">
        {
            children
        }
    </div>
  )
}
