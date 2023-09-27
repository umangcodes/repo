import { useEffect, useRef, useLayoutEffect } from "react";

interface Props {
  type: "text" | "number" | "file" | "tel" | "email",
  label: string,
  register: any,
  name: string,
  required?: any,
  pattern?: any,
  maxLength?: {
    value: number,
    message: string
  },
  minLength?: {
    value: number,
    message: string
  },
  errors: any,
  value?: any, //required for floating label animation
  rows?: number,
  disabled?: boolean,
  padding?: any,
  fontSize?: string,
  customClass?: string,
  placeholder: string,
  onChange?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
  innerRef?: React.MutableRefObject<HTMLInputElement | null>

}

const TextInput: React.FC<Props> = (
  {
    type,
    label,
    register,
    name,
    required,
    pattern,
    maxLength,
    minLength,
    errors,
    value,
    rows,
    disabled,
    fontSize = "14px",
    padding,
    customClass,
    placeholder,
    onChange,
    innerRef
  }
) => {

  const { ref, ...rest } = register(name, {
    required,
    pattern,
    maxLength,
    minLength
  })

  return (
    <div className="w-full flex flex-col">
      <p className="hidden md:block text-sm text-black font-medium mb-1">{label}</p>
      <input
        {...rest}
        type={type}
        ref={(e) => {
          ref(e)
          if (innerRef && e) {
            innerRef.current = e;
          }
        }}
        name={name}
        value={value}
        maxLength={maxLength?.value}
        minLength={minLength?.value}
        onKeyUp={(e) => onChange && onChange(e)}
        placeholder={placeholder}
        className={`${customClass} ${disabled && "bg-primary/20"}
         w-full text-sm border px-3 py-3 placeholder:text-black/40 placeholder:font-light 
          border-[#8A8A8A] outline-none focus:outline-none rounded-sm`} />
      {errors[name] && <p className="text-xs font-medium text-red-400">{errors[name].message}</p>}
    </div>
  )
}

export default TextInput;