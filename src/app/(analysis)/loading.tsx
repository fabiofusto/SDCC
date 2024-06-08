'use client'

import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Loader2 } from "lucide-react"

const LoadingPage = () => {
    return (
        <MaxWidthWrapper className="w-full h-full flex flex-col flex-1 items-center justify-center">
            <Loader2 className="animate-spin size-8 md:size-12 lg:size-15 text-zinc-400"/>
        </MaxWidthWrapper>
    )
}

export default LoadingPage