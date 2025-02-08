import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { auth, signOut, signIn } from '@/auth'

const Navbar = async () => {
  const session = await auth();
  console.log("session",session);
  
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between'>
        <Link href='/' className='w-36'>
            <Image src='/assets/images/logo.svg' width={128} height={128} alt='logo' />
        </Link>

        <div className='flex w-32 justify-end'>
        <div className='flex items-center gap-5'>
          { session && session?.user ? (
              <>
                <Link href="/startup/create">
                  <span>Create</span>
                </Link>
                <form action={async () => {
                      "use server";
                      await signOut( { redirectTo: "/" })
                  }}>
                  <button type="submit">
                    <span>Logout</span>
                  </button>
                </form>
                <Link href={`/user/${session?.id}`}>
                  <span>{session?.user?.name}</span>
                </Link>
              </>
            ) : (
              <form action={async () => {
                      "use server";
                      await signIn()
                  }
              }>
              <button type="submit">
                <span>Login</span>
              </button>
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
