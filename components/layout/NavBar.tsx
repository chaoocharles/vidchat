'use client'

import { UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Container from "./Container";
import { Video } from "lucide-react";

const NavBar = () => {
    const router = useRouter()
    const { userId } = useAuth()

    return (<div className="sticky top-0 border border-b-primary/10 bg-secondary">
        <Container>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => router.push('/')}>
                    <Video />
                    <div className="font-bold text-xl">VidChat</div>
                </div>
                <div className="flex gap-3 items-center">
                    <UserButton afterSignOutUrl="/" />
                    {!userId && <>
                        <Button onClick={() => router.push('/sign-in')} variant='outline' size='sm'>Sign in</Button>
                        <Button onClick={() => router.push('/sign-up')} size='sm'>Sign up</Button>
                    </>}
                </div>
            </div>
        </Container>
    </div>);
}

export default NavBar;