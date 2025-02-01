import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between'>
        <Link href='/' className='w-36'>
            <Image src='/assets/images/logo.svg' width={128} height={128} alt='logo' />
        </Link>

        <div className='flex w-32 justify-end'>
            
        </div>
      </div>
    </header>
  )
}

export default Navbar
