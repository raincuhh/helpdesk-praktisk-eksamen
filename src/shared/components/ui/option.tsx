import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

// Define variants for the option component
const optionVariants = cva("transition-colors duration-100 ease-in-out", {
	variants: {
		variant: {
			base: "hover:bg-input text-foreground focus:outline-none focus:bg-input text-current bg-popover",
		},
		size: {
			sm: "py-1 px-2 text-sm",
			md: "py-2 px-4 text-md",
			lg: "py-3 px-6 text-lg",
		},
	},
	defaultVariants: {
		variant: "base",
		size: "md",
	},
});

export type OptionProps = React.OptionHTMLAttributes<HTMLOptionElement> & VariantProps<typeof optionVariants>;

const Option = forwardRef<HTMLOptionElement, OptionProps>(({ className, variant, ...props }, ref) => {
	const classes = optionVariants({ variant, className });

	return <option ref={ref} className={classes} {...props} />;
});

export default Option;
