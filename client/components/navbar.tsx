"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import ConnectWalletButton from "./test/simple-connect"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/panda-logo.png" alt="Logo" className="w-10 mr-3"/>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
                Questpanda
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">

          <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Home
            </Link>

            <Link
              href="/quests"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/quests")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Quests
            </Link>


            
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Creators
            </Link>
            {/* <Link
              href="/leaderboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/leaderboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Leaderboard
            </Link> */}

            <Link
              href="/brand"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/brand")
                  ? "text-fuchsia-700 bg-brand-light"
                  : "text-fuchsia-700 hover:text-fuchsia-700 hover:bg-brand-light/50"
              }`}
            >
              Brands
            </Link>

            {/* <div className="items-center space-x-4">
              <ConnectWalletButton />
           </div> */}

          </div>

          <div className="hidden md:flex items-center space-x-4">
          <div className="items-center space-x-4">
            {/* User Dropdown or Auth Button */}
              <ConnectWalletButton />
           </div>
           
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-brand-light text-brand-purple">
                  <span className="sr-only">User menu</span>
                  <span className="text-sm font-medium">JD</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 text-gray-800">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="hover:bg-brand-light hover:text-brand-purple">
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-brand-light hover:text-brand-purple">
                  <Link href="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="hover:bg-brand-light hover:text-brand-purple">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-brand-purple hover:bg-brand-light/50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/quests"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/quests")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Quests
            </Link>
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/dashboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Creators
            </Link>

            {/* <Link
              href="/leaderboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/leaderboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link> */}

            <Link
              href="/brand"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/brand")
                  ? "text-fuchsia-700 bg-brand-light"
                  : "text-fuchsia-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </Link>

            <div className="items-center space-x-4">
            {/* User Dropdown or Auth Button */}
              <ConnectWalletButton />
           </div>

            {/* <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-brand-light flex items-center justify-center text-brand-purple">
                    <span className="text-sm font-medium">JD</span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">John Doe</div>
                  <div className="text-sm font-medium text-gray-500">john@example.com</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign out
                </button>
              </div>
            </div> */}






          </div>
        </div>
      )}
    </nav>
  )
}
