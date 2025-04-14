import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import Image from "next/image";

interface DiscordMessageProps {
  avatarSrc: string;
  avatarAlt: string;
  userName: string;
  timeStamp: string;
  badgeText?: string;
  badgeColor?: string;
  title: string;
  content: {
    [key: string]: string;
  };
}




const getBadgeColor =(color:string)=>{
    switch(color){
        case "#43b581":
            return "bg-green-500/10 text-green-400 ring-green-500/20"
        case "#faa61a":
            return "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
        default:
            return "bg-gray-500/10 text-gray-400 ring-gray-500/20"
 
    }
}

export const DiscordMessage = ({
  avatarAlt,
  avatarSrc,
  content,
  timeStamp,
  title,
  userName,
  badgeColor = "#43b581",
  badgeText,
}: DiscordMessageProps) => {


    
  return (
    <div className="w-full flex items-start justify-start">
      <div className="flex items-center mb-2">
        <Image
          src={avatarSrc}
          alt={avatarAlt}
          width={40}
          height={40}
          className="rounded-full object-cover mr-3"
        />
        <div className="w-full max-w-xl">
            <div className="flex items-center">
            <p className="font-semibold text-white">{userName}</p>
            <span className="ml-2 px-1.5 text-xs font-semibold bg-brand-600">
                APP
            </span>
            <span className="text-gray-400 text-xs ml-1.5 font-medium">{timeStamp}</span>
            </div>
        
        <div className="bg-[#2f3136] text-sm w-full rounded p-3 mb-4 mt-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                {badgeText?(
                    <span className={cn("inline-flex order-2 items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset", getBadgeColor(badgeColor))}>
                        {badgeText}
                    </span>
                ):null}
                   <p className="font-semibold text-white text-base/7 order-1">{title}</p>
            </div>

            {
                Object.entries(content).map(([key,value])=>(
                    <p  key={key} className="text-sm/6 text-[#dcddde]">
                        <span className="text-[#b9bbbe]">{key}:</span>{value}
                    </p>
                ))
            }


            <p className="text-[#72767d] text-xs flex items-center mt-2">
                <Clock className="size-3 mr-1"/>
                {timeStamp}
            </p>
         
        </div>
        </div>
        
       
      </div>
    
    </div>
  );
};
