import React, { forwardRef } from 'react';

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
	options?: SelectOption[];
	placeholder?: string;
	children?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ label, error, icon, options, placeholder, children, className = '', ...props }, ref) => {
		return (
			<div className="w-full">
				{label && (
					<label className="block text-sm font-medium text-gray-700 mb-1">
						{label}
					</label>
				)}
				<div className="relative w-full">
					{icon && (
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
							<div className="text-gray-400">{icon}</div>
						</div>
					)}
					<select
						ref={ref}
						className={`
							w-full bg-transparent text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 pr-10 transition duration-300 ease
							focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow
							appearance-none cursor-pointer
							${icon ? 'pl-10' : ''}
							${error ? 'border-red-500 focus:border-red-500 focus:shadow-red-100' : ''}
							${className}
						`}
						{...props}
					>
						{placeholder && (
							<option value="" disabled>
								{placeholder}
							</option>
						)}
						{options?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
						{children}
					</select>
					{/* Custom dropdown arrow */}
					<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<svg
							className="h-4 w-4 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				</div>
				{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
			</div>
		);
	},
);

Select.displayName = 'Select';

export default Select;
