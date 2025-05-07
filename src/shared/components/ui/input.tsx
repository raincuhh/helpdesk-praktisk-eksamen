import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

const inputVariants = cva("select-all border-solid border-[1px] transition-colors duration-100 ease-in-out", {
	variants: {
		variant: {
			base: "hover:bg-input focus:outline-2 focus:outline-offset-2 focus:outline-primary-foreground border-border hover:border-border hover:focus:border-primary-foreground rounded-sm px-4 py-2 placeholder:text-muted-foreground focus:outline-none focus:outline-primary-foreground focus:outline-offset-2",
		},
		size: {
			sm: "py-1 px-2 text-fs-sm",
			md: "py-2 px-4 text-fs-md",
			lg: "py-3 px-6 text-fs-lg",
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
		rounded: "full",
	},
});

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
	VariantProps<typeof inputVariants> & {
		type?: "text" | "password";
	};

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, type = "text", checked, ...props }, ref) => {
		const classes = inputVariants({ variant, className });

		return (
			<>
				<input ref={ref} type={type} className={classes} {...props} />
			</>
		);
	}
);

export default Input;
