import React from "react"
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import NavItems from "./NavItems";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
            <Image src="/assets/icons/menu.svg" width={24} height={24} alt="menu" className="cursor-pointer"/>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
            <Image src="/assets/images/logo.svg" width={128} height={38} alt="logo" />

            <Separator orientation="horizontal" className="border border-gray-150" />

            <NavItems />
        </SheetContent>
        </Sheet>
    </nav>
  )
}

export default MobileNav
