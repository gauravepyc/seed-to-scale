import Featuredv2 from '@/components/Homepage2/Featuredv2'
import Herov2 from '@/components/Homepage2/Herov2'
import StatsV2 from '@/components/Homepage2/StatsV2'
import Libraryv2 from '@/components/Homepage2/LibraryV2'
import Logo from '@/components/Navbar/Logo'
import React from 'react'
import FaqV2 from '@/components/Homepage2/FAQsV2'
import AboutV2 from '@/components/Homepage2/AboutV2'
import FrameworkV2 from '@/components/Homepage2/FrameworkV2'
import GooeyLayers from '@/components/Homepage2/GooeyLayers'
import CubeIntrerationsection from '@/components/Homepage2/CubeIntrerationsection'

export default function page() {
    return (
        <div className='main-wrapper relative '>
            <div className='wrapper px-[5vw] z-10 bg-background rounded-b-[5vw] relative'>
                <span className='absolute h-full w-px bg-foreground/25 left-[5vw] top-0' />
                <span className='absolute h-full w-px bg-foreground/25 right-[5vw] top-0' />
                <Herov2 />
                <CubeIntrerationsection />
                {/* <GooeyLayers /> */}
                <Featuredv2 />
                <Libraryv2 />
                <StatsV2 />
                <AboutV2 />
                <FrameworkV2 />
                <FaqV2 />
            
            </div>

            <footer className='sticky bottom-0 z-1 flex h-screen w-full items-center justify-center bg-[#0F2124] px-[5vw] text-[#FBF8F3] [&_svg:first-of-type]:w-[28vw] [&_svg:first-of-type]:max-w-none [&_svg:first-of-type]:min-w-0'>
                <Logo className='scale-200' />
            </footer>
        </div>
    )
}
