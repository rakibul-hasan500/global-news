import Link from "next/link";
import {IoHomeSharp} from "react-icons/io5";

function HomeButton() {
    return (
        <Link href="/" aria-label="Go to home page" className="fixed top-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
            <IoHomeSharp size={19}/>
        </Link>
    );
}

export default HomeButton;