import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { auth, signOut, signIn } from '@/auth'
import { Button } from '../ui/button'
import NavItems from '@/components/shared/NavItems'
import MobileNav from '@/components/shared/MobileNav'

const Navbar = async () => {
  const session = await auth();

  return (
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between'>
        <Link href='/' className='w-36'>
            <Image src='/assets/images/logo.svg' width={128} height={128} alt='logo' />
        </Link>
        { session && session?.user && (
          <nav className='hidden md:flex-between w-full max-w-xs gap-5'>
            <NavItems />
          </nav>
        )}
        <div className='flex justify-end'>
          <div className='flex items-center gap-5'>
            { session && session?.user ? (
                <>
                  <form
                    // className="hidden md:block"
                     action={async () => {
                        "use server";
                        await signOut( { redirectTo: "/" })
                    }}>
                    <Button className="rounded-full" size="lg" type="submit">
                      Logout
                    </Button>
                  </form>
                  <Link href={`/user/${session?.user?.id}`}>
                    <Image
                      src={session?.user?.image}
                      alt={session?.user?.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                      sizes="lg"
                    />
                  </Link>
                  <MobileNav />
                </>
              ) : (
                <form action={async () => {
                        "use server";
                        await signIn()
                    }
                }>
                  <Button asChild className="rounded-full" size="lg">
                      <Link href="/login">Login</Link>
                    </Button>
              </form>
              )
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
