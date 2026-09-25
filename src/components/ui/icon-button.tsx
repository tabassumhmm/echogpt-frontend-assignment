import type * as React from "react";

import { Button } from "@/components/ui/button";

type IconButtonProps = React.ComponentProps<typeof Button> & {
	label: string;
};

export function IconButton({ label, children, ...props }: IconButtonProps) {
	if (label.trim().length === 0)
		throw new Error("IconButton requires a non-empty label");

	return (
		<Button aria-label={label} size="icon" {...props}>
			{children}
		</Button>
	);
}
