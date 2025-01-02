"use client"
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";


const Navbar = () => {
    const {data: session} = useSession()

    const user: User = session?.user
    return ( 
        <nav className="bg-yellow-400 p-5 bg-opacity-95 backdrop-blur-md shadow-2xl border-b-2 border-yellow-500 rounded-b-lg">
            <div className="w-full flex justify-between items-center">
                <Link href={"#"} className="font-bold text-3xl text-white ">SecretMSG</Link>
                <div className="flex gap-4 justify-center items-center">
                {
                    session ? (
                        <>
                            <span className="font-bold text-white text-lg">Welcome {user.username}!</span>
                            <Button onClick={() => signOut()} className="font-bold">Logout</Button>
                        </>
                        
                    ) : (
                        <Link href={"/sign-in"}>
                            <Button>Login</Button>
                        </Link>
                    )
                }
                </div>
            </div>
        </nav>
    );
}
 
export default Navbar;