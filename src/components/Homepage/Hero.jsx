import React from 'react'
import Button from '@/components/Button/Button'
import SplitText from '@/components/Reusable/SplitText'

export default function Hero() {
    return (
        <div className='h-screen border-b border-foreground/25 py-[6vw] flex items-center justify-center bg-background w-full'>
            <div className='space-y-[1vw] mt-[5vw] flex items-center justify-center flex-col text-center'>

                <SplitText as="h1" className='text-primary leading-[1.25] w-full text-center text-hero'>The Working Files</SplitText>
                <SplitText as="p" className='text-content w-[55vw]'>Ground-level thinking on AI, from the people closest to the frontier — the working versions, before they're report-ready.</SplitText>

                <Button className='mt-[1vw]' title="Read The Latest" />
            </div>
        </div>
    )
}
