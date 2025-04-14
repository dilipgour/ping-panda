import { PropsWithChildren } from "react";
import { Icons } from "./icons";
import {
  Cog,
  Gift,
  Headphones,
  HelpCircle,
  Inbox,
  Menu,
  Mic,
  Phone,
  Pin,
  PlusCircle,
  Search,
  Smile,
  Sticker,
  UserCircleIcon,
  Video,
} from "lucide-react";
import Image from "next/image";

export const MockDiscordUI = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-[800px] w-full max-w-[1200px] bg-discord-background text-white  rounded-lg overflow-hidden shadow-xl">
      <div className="hidden md:flex w-[72px] bg-[#202225] py-3 flex-col items-center ">
        <div className="size-12 bg-discord-brand-color flex items-center justify-center rounded-2xl mb-2 hover:rounded-xl transition-all duration-200">
          <Icons.discord className="size-8 text-white" />
        </div>
        <div className="w-8 h-[2px] bg-discord-background rounded-full my-2" />
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-discord-background flex justify-center items-center mb-3 size-12 rounded-3xl hover:rounded-xl transition-all duration-200 hover:bg-discord-brand-color cursor-not-allowed"
          >
            <span className="text-lg font-semibold text-gray-400">
              {String.fromCharCode(65 + index)}
            </span>
          </div>
        ))}

        <div className="bg-discord-background flex justify-center items-center mb-3 size-12 rounded-3xl hover:rounded-xl transition-all duration-200 hover:bg-[#3ba55c] cursor-not-allowed group">
          <PlusCircle className="text-[#3ba55c] group-hover:text-white" />
        </div>
      </div>

      <div className="hidden md:flex w-60 bg-[#2f3136] flex-col">
        <div className="px-4 h-16 border-b border-[#202225] flex items-center shadow-sm">
          <div className="w-full bg-[#    202225] text-sm flex items-center h-8 justify-center px-2 text-gray-500 cursor-not-allowed">
            Find or start a conversation
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pt-4">
          <div className="px-2 mb-4">
            <div className="flex items-center text-sm px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <UserCircleIcon className="mr-4 size-8 text-[#b9bbbe]" />
              <span className="font-medium text-sm">Friends</span>
            </div>
            <div className="flex items-center text-sm px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <Inbox className="mr-4 size-8 text-[#b9bbbe]" />
              <span className="font-medium text-sm">Nitro</span>
            </div>
          </div>

          <div className="px-2 mb-4">
            <h3 className="text-xs font-semibold text-[#8e9297] px-2 mb-2 uppercase">
              Direct Messages
            </h3>
            <div className="flex items-center px-2 py-1.5 rounded bg-[#393c43] text-white cursor-pointer">
              <Image
                src="/brand-asset-profile-picture.png"
                height={32}
                width={32}
                alt="brand-image"
                className="rounded-full object-cover mr-2"
              />
              <span className="font-medium">PingPanda</span>
            </div>

            <div className="my-1 space-y-px">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center  cursor-not-allowed px-2 py-1.5 text-gray-600 rounded"
                >
                  <div className="size-8 bg-discord-background rounded-full mr-3" />
                  <span className="font-medium">User {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-2 bg-[292b2f] flex items-center">
          <div className="size-8 rounded-full bg-brand-700 mr-2" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">You</p>
            <p className="text-xs text-[#b9bbbe] flex items-center">
              @your_account
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Mic className="size-5 text-[#b9bbbe] hover:text-white cursor-pointer" />
            <Headphones className="size-5 text-[#b9bbbe] hover:text-white cursor-pointer" />
            <Cog className="size-5 text-[#b9bbbe] hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-[36393f] shadow-sm border-b flex items-center px-4 border-[#202225]">
          <div className="md:hidden mr-4">
            <Menu className="size-6 text-[b9bbbe] cursor-pointer hover:text-white" />
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Image
                src="/brand-asset-profile-picture.png"
                alt="brand-image"
                width={40}
                height={40}
                className="object-cover rounded-full mr-3"
              />
              <div className="absolute size-3 rounded-full bg-green-500 bottom-0 border-2 border-[#36393f] right-3" />
            </div>
            <p className="text-white font-semibold"> PingPanda</p>
          </div>

          <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
            <Phone className="size-5 hover:text-white cursor-not-allowed sm:hidden md:block" />
            <Video className="size-5 hover:text-white cursor-not-allowed sm:hidden md:block" />
            <Pin className="size-5 hover:text-white cursor-not-allowed sm:hidden md:block" />
            <UserCircleIcon className="size-5 hover:text-white cursor-not-allowed sm:hidden md:block" />
            <Search className="size-5 hover:text-white cursor-not-allowed sm:hidden md:block" />
            <Inbox className="size-5 hover:text-white cursor-not-allowed sm:hidden md:block" />
            <HelpCircle className="size-5 hover:text-white cursor-not-allowed sm:hidden md:block" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-discord-background flex flex-col-reverse">
          {children}
        </div>

        <div className="p-4">
          <div className="flex items-center bg-[#40444b] rounded-lg p-1">
            <PlusCircle className="mx-3 text-[#b9bbbe] hover:text-white cursor-not-allowed" />
            <input
              type="text"
              readOnly
              placeholder="Message @PingPanda"
              className="flex-1 bg-transparent py-2.5 px-1 focus:outline-none text-white placeholder-[#72767d] cursor-not-allowed"
            />
            <div className="flex items-center gap-x-3 text-[#b9bbbe]">
              <Gift className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
              <Sticker className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
              <Smile className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
