import type { CSSProperties } from "react";

interface LoaderProps {
    size?: number;
    color?: string;
}

function Loader({size = 20, color = "var(--color-primary)"}: LoaderProps) {

    const style: CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
        borderTopColor: color,
    };

    return (
        <span
            role="status"
            aria-label="Loading"
            className=" inline-block animate-spin rounded-full border-[3px] border-gray-200 border-t-transparent"
            style={style}
        />
    );
}

export default Loader;