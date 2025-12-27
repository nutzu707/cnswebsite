import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex w-full h-[100vh] justify-center items-center">
            <Link href="/">
                <h2 className="text-[32px] text-red-500 font-bold">404</h2>
            </Link>
        </div>
    );
}