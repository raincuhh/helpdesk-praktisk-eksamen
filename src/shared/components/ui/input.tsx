import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

const inputVariants = cva("select-all border-solid border-[1px] transition-colors duration-100 ease-in-out", {
	variants: {
		variant: {
			base: "hover:bg-modifier-primary-form-field focus:outline-2 focus:outline-offset-2 focus:outline-modifier-border-color border-modifier-border-color hover:border-modifier-border-hover hover:focus:border-modifier-border-color rounded-radius-sm px-4 py-2 placeholder:text-form-placeholder focus:outline-none focus:outline-modifier-border-color focus:outline-offset-[0px]",
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
