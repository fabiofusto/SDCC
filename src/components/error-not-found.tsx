'use client'

import Image from "next/image"
import { MaxWidthWrapper } from "./max-width-wrapper"

export const ErrorBanner = ({title} : {title: string}) => {
    return (
        <MaxWidthWrapper className="flex flex-col items-center justify-center mt-16 lg:mt-32">
                <Image 
                    src="/snake-3.png"
                    alt='snake in the box'
                    width={150}
                    height={150}
                />
                <h1 className="mt-2 text-xl lg:text-3xl font-bold">No {title} found</h1>
        </MaxWidthWrapper>
    )
}