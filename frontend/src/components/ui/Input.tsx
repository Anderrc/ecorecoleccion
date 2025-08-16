import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, icon, className = '', ...props }, ref) => {
		return (
			<div className="w-full">
				{label && (
					<label className="block text-sm font-medium text-gray-700 mb-1">
						{label}
					</label>
				)}
				<div className="relative">
					{icon && (
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<div className="text-gray-400">{icon}</div>
						</div>
					)}
											<div className="w-full max-w-sm min-w-[200px]">
												<input
													ref={ref}
													className={`
														w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease
														focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow
														${icon ? 'pl-10' : ''}
														${error ? 'border-red-500 focus:border-red-500 focus:shadow-red-100' : ''}
														${className}
													`}
													{...props}
												/>
											</div>
				</div>
				{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
			</div>
		);
	},
);

Input.displayName = 'Input';

export default Input;

