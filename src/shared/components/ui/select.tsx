import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

// Define variants for the select component
const selectVariants = cva("select-all border-solid transition-colors duration-100 ease-in-out", {
	variants: {
		variant: {
			base: "hover:bg-input focus:outline-2 focus:outline-offset-2 focus:outline-primary-foreground border-border hover:border-border hover:focus:border-primary-foreground rounded-sm px-4 py-2 placeholder:text-muted-foreground focus:outline-none focus:outline-primary-foreground focus:outline-offset-2",
		},
		size: {
			sm: "py-1 px-2 text-sm",
			md: "py-2 px-4 text-md",
			lg: "py-3 px-6 text-lg",
		},
		rounded: {
			sm: "rounded-sm",
			md: "rounded-md",
			full: "rounded-full",
		},
	},
	defaultVariants: {
		variant: "base",
		size: "md",
		rounded: "sm",
	},
});

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & VariantProps<typeof selectVariants>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, variant, ...props }, ref) => {
	const classes = selectVariants({ variant, className });

	return <select ref={ref} className={classes} {...props} />;
});

export default Select;
