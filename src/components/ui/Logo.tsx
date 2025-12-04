import Image from 'next/image';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export function Logo({ className, width = 150, height = 32 }: LogoProps) {
    return (
        <Image
            src="/logo.svg"
            alt="fi-tracker logo"
            width={width}
            height={height}
            className={className}
            priority
        />
    );
}
