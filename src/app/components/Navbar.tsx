import React from 'react'

const Navbar = () => {
  return (
    <nav className='absolute top-0 left-0 w-full h-16 flex flex-row justify-between px-8 py-6 bg-zinc-900'>
            <span>Teens Lift Teens</span>
            <div className='flex gap-4'>
                <span>Login</span>
                <span>Sign Up</span>
            </div>
    </nav>
  )
}

export default Navbar