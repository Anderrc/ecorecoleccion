import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
	resize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ label, error, icon, resize = true, className = '', ...props }, ref) => {
		return (
			<div className="w-full">
				{label && (
					<label className="block text-sm font-medium text-gray-700 mb-1">
						{label}
					</label>
				)}
				<div className="relative w-full">
					{icon && (
						<div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
							<div className="text-gray-400">{icon}</div>
						</div>
					)}
					<textarea
						ref={ref}
						className={`
							w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease
							focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow
							${icon ? 'pl-10' : ''}
							${error ? 'border-red-500 focus:border-red-500 focus:shadow-red-100' : ''}
							${!resize ? 'resize-none' : 'resize-y'}
							${className}
						`}
						{...props}
					/>
				</div>
				{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
			</div>
		);
	},
);

Textarea.displayName = 'Textarea';

export default Textarea;
