import { type ReactNode } from "react"

type size = "sm" | "lg"

const formSizes = (size: size) => {
  if (!size) return ""
  return `form-control-${size}`
}

type FormProps = {
  children: ReactNode
  onSubmit: () => void
}
export function Form({
  children,
  onSubmit
}: FormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      {children}
    </form>
  )
}

type FormFieldProps = {
  label: string
  type?: string
  id?: string
  placeholder?: string
  size?: size
  text?: string
  value?: string
  disabled?: boolean
  readonly?: boolean
}
export function FormField({
  label,
  type = "text",
  id = "formField",
  placeholder,
  size,
  text,
  value,
  disabled,
  readonly,
}: FormFieldProps) {
  const labelContent =<label 
    htmlFor={id} 
    className="form-label">
      {label}
  </label>

  const inputContent = <input 
    type={type}
    className={`form-control ${formSizes(size!)}`}
    id={id}
    placeholder={placeholder}
    value={value}
    disabled={disabled}
    readOnly={readonly}
  />

  const textContent = text && <div 
    id={`${id}HelpBlock`}
    className="form-text">
      {text}
  </div>

  return (
    <>
      {labelContent}
      {inputContent}
      {textContent}
    </>
  )
}

type OptionProps = {
  value: string
  text: string
  selected?: boolean
}
export function Option({
  value,
  text,
  selected
}: OptionProps) {
  return (
    <option
      value={value}
      selected={selected}
    >
      {text}
    </option>
  )
}

type SelectProps = {
  options: OptionProps[]
  size?: size
  window?: number
  disabled?: boolean
}
export function Select({
  options,
  size,
  window,
  disabled
}: SelectProps) {
  return (
    <select
      className={`form-select ${formSizes(size!)}`}
      disabled={disabled}
      {...(window ? { size: window } : {})}
    >
      {options.map((option, index) => (
        <Option key={index} {...option} />
      ))}
    </select>
  )
}

type CheckProps = {
  value: string
  label: string
  id?: string
  checked?: boolean
  disabled?: boolean
  isSwitch?: boolean
}
export function Check({
  value,
  label,
  id = "checkbox",
  checked,
  disabled,
  isSwitch
}: CheckProps) {
  const inputContent = <input 
    className="form-check-input" 
    type="checkbox" 
    value={value} 
    id={id} 
    disabled={disabled}
    checked={checked}
    {...(isSwitch ? { role: "switch" } : {})}
  />

  const labelContent = <label 
    className="form-check-label" 
    htmlFor={id}>
      {label}
  </label>

  return (
    <div className={`form-check ${isSwitch ? "form-switch" : ""}`}>
      {inputContent}
      {labelContent}
    </div>
  )
}

type RadioProps = {
  value: string
  label?: string
  groupName?: string
  id?: string
  checked?: boolean
  disabled?: boolean
}
export function Radio({
  value,
  label,
  groupName = "radioGroup",
  id = "radio",
  checked,
  disabled
}: RadioProps) {
  const inputContent = <input
    className="form-check-input"
    type="radio"    
    name={groupName}
    id={id}
    checked={checked}
    disabled={disabled}
    value={value}
  />

  const labelContent = <label
    className="form-check-label"
    htmlFor={id}
  >
    {label}
  </label>

  return (
    <div className="form-check">
      {inputContent}
      {labelContent}
    </div>
  )
}
