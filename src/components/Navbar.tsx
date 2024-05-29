import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header className='sticky top-0 h-16 bg-white flex items-center justify-center shadow'>
      <ul className='flex gap-20 font-semibold text-xl'>
        <li className='hover:text-blue-500'>
          <Link href='/'>Blog</Link>
        </li>
        <li className='hover:text-blue-500'>
          <Link href='/users'>User</Link>
        </li>
      </ul>
    </header>
  )
}

export default Navbar