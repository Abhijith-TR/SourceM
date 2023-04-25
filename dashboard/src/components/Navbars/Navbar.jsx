import React from 'react'
import sourceCode from '../../assets/sourceCode.png'

function Navbar() {
  return (
    <>
                      
      <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div class=" flex flex-wrap items-center justify-between mx-2 p-4">
        <a href="https://flowbite.com/" class="flex items-center">
            <img src={sourceCode} class="bg-white mx-3 ml-1" alt="sourceM Logo" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">sourceM</span>
        </a>
        <div class="flex justify-between md:order-last">
            <button type="button" class="text-white bg-blue-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Logout</button>
        </div>
        
        </div>
      </nav>

              
    </>
  )
}

export default Navbar