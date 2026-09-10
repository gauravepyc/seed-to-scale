import Logo from '@/components/Navbar/Logo'
import BookDetailHero from '@/components/BookDetail/Hero'
import Highlights from '@/components/BookDetail/Highlights'
import AuthorQuote from '@/components/BookDetail/AuthorQuote'
import Spectrum from '@/components/BookDetail/Spectrum'
import HowThisWasBuilt from '@/components/BookDetail/HowThisWasBuilt'
import Download from '@/components/BookDetail/Download'
import Related from '@/components/BookDetail/Related'
import React from 'react'

export default function page() {
    return (
        <div className='main-wrapper relative '>
            <div className='wrapper z-10 relative overflow-hidden rounded-b-[5vw] bg-background'>
                <div className='bg-foreground'>


                    <span className='pointer-events-none absolute left-[5vw] top-0 z-20 h-full w-px bg-foreground/25' />
                    <span className='pointer-events-none absolute right-[5vw] top-0 z-20 h-full w-px bg-foreground/25' />
                    <BookDetailHero />
                </div>
                <div className='px-[5vw] mt-[5vw] bg-background '>


                    <Highlights />
                    <HowThisWasBuilt />
                    <AuthorQuote />
                    <Spectrum />
                </div>
                <Download />
                <div className='px-[5vw] bg-background '>
                    <Related />
                </div>
            </div>

            <footer className='sticky bottom-0 z-1 flex h-screen w-full items-center justify-center bg-[#0F2124] px-[5vw] text-[#FBF8F3] [&_svg:first-of-type]:w-[28vw] [&_svg:first-of-type]:max-w-none [&_svg:first-of-type]:min-w-0'>
                <Logo className='scale-200' />
            </footer>
        </div>
    )
}
