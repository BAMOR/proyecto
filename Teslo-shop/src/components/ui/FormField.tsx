import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type Variant = "dark" | "light";

const LABEL_STYLES: Record<Variant, string> = {
    dark: "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1",
    light: "block text-sm font-semibold text-slate-700 mb-1",
};

const CONTROL_STYLES: Record<Variant, string> = {
    dark: "w-full bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors",
    light: "w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors",
};

type InputFieldProps = {
    label: string;
    nota?: string;
    variant?: Variant;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({ label, nota, variant = "dark", id, ...props }: InputFieldProps) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
        <div>
            <label htmlFor={fieldId} className={LABEL_STYLES[variant]}>
                {label} {nota && <span className="text-gray-600 normal-case font-normal">{nota}</span>}
            </label>
            <input id={fieldId} {...props} className={CONTROL_STYLES[variant]} />
        </div>
    );
};

type SelectFieldProps = {
    label: string;
    children: ReactNode;
    variant?: Variant;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = ({ label, children, variant = "dark", id, ...props }: SelectFieldProps) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
        <div>
            <label htmlFor={fieldId} className={LABEL_STYLES[variant]}>{label}</label>
            <select id={fieldId} {...props} className={CONTROL_STYLES[variant]}>
                {children}
            </select>
        </div>
    );
};

type TextAreaFieldProps = {
    label: string;
    variant?: Variant;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = ({ label, variant = "dark", id, ...props }: TextAreaFieldProps) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
        <div>
            <label htmlFor={fieldId} className={LABEL_STYLES[variant]}>{label}</label>
            <textarea id={fieldId} {...props} className={`${CONTROL_STYLES[variant]} resize-none`} />
        </div>
    );
};
