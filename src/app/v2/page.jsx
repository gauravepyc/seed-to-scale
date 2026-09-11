import Logo from '@/components/Navbar/Logo'
import React from 'react'

export default function page() {
    return (
        <div className='main-wrapper relative '>
            <div className='wrapper px-[5vw] z-10 bg-background rounded-b-[5vw] relative'>
                <span className='absolute h-full w-px bg-foreground/25 left-[5vw] top-0' />
                <span className='absolute h-full w-px bg-foreground/25 right-[5vw] top-0' />
                {/* <Hero />
                <AboutTheSeries />
                <Stats />
                <FeaturedFile />
                <Library />
                <Framework />
                <Faq /> */}
            </div>

            <footer className='sticky bottom-0 z-1 flex h-screen w-full items-center justify-center bg-[#0F2124] px-[5vw] text-[#FBF8F3] [&_svg:first-of-type]:w-[28vw] [&_svg:first-of-type]:max-w-none [&_svg:first-of-type]:min-w-0'>
                <Logo className='scale-200' />
            </footer>
        </div>
    )
}
