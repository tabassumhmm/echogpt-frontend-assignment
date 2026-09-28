import type { ReactNode } from "react";

interface RevealProps {
	children: ReactNode;
	className?: string;
}

export function Reveal({ children, className }: RevealProps) {
	return (
		<div className={className ? `reveal ${className}` : "reveal"}>
			{children}
		</div>
	);
}
