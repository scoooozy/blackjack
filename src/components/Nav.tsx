import {
    Disclosure,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignOutButton,
    useClerk,
} from "@clerk/clerk-react";
import { GiTwoCoins } from "react-icons/gi";

export default function Nav({ points }: { points: number }) {
    const { user } = useClerk();
    return (
        <Disclosure as="nav" className="bg-white navbar">
            <div className="dream mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <h2 className="flex items-center gap-1">Balance: {points}<GiTwoCoins className="text-yellow-500" /></h2>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <SignedOut>
                                        <SignInButton />
                                </SignedOut>
                                <SignedIn>
                                    <MenuButton className="relative flex rounded-full text-sm focus:outline-none">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src={
                                                user?.hasImage
                                                    ? user.imageUrl
                                                    : "/user.png"
                                            }
                                            alt="User Avatar"
                                        />
                                    </MenuButton>
                                </SignedIn>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                    >
                                        Your Profile
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                    >
                                        Settings
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                        <SignOutButton />
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>
        </Disclosure>
    );
}
