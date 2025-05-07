import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

// Define variants for the textarea component
const textareaVariants = cva("select-all border-solid transition-colors duration-100 ease-in-out", {
	variants: {
		variant: {
			base: "border hover:bg-input focus:outline-2 focus:outline-offset-2 focus:outline-primary-foreground border-border hover:border-border hover:focus:border-primary-foreground rounded-sm px-4 py-2 placeholder:text-muted-foreground focus:outline-none focus:outline-primary-foreground focus:outline-offset-2",
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

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
	VariantProps<typeof textareaVariants>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant, ...props }, ref) => {
	const classes = textareaVariants({ variant, className });

	return <textarea ref={ref} className={classes} {...props} />;
});

export default Textarea;
