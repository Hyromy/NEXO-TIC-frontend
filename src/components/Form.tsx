import { 
  type ReactNode,
  useState,
} from "react"

import { getDataFromForm } from "../utils/getters"

type size = "sm" | "lg"
type textType = "text" | "password"
type formLabelType = "label" | "check"

const formSizes = (size: size) => {
  if (!size) return ""
  return `form-control-${size}`
}

const textFieldLabelContent = (
  label: string,
  id: string,
  typeForm: formLabelType = "label"
) => {
  if (!label) return null
  return (
    <label htmlFor={id} className={`form-${typeForm == "check" ? "check-" : ""}label`}>
      {label}
    </label>
  )
}

const textFieldTextContent = (text: string, id: string) => {
  if (!text) return null
  return (
    <div id={`${id}HelpBlock`} className="form-text">
      {text}
    </div>
  )
}

type FormProps = {
  children: ReactNode
  onSubmit: (data: any) => void
}
export function Form({
  children,
  onSubmit
}: FormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(
          getDataFromForm(
            new FormData(
              e.currentTarget as HTMLFormElement
            )
          )
        )
      }}
    >
      {children}
    </form>
  )
}

type TextFieldProps = {
  name: string
  type?: textType
  label?: string
  id?: string
  placeholder?: string
  size?: size 
  text?: string
  value?: string
  disabled?: boolean
  readonly?: boolean
  onChange?: (value: string) => void
}
export function TextField({
  name,
  type = "text",
  label,
  id = `field-${name}`,
  placeholder,
  size,
  text,
  value,
  disabled,
  readonly,
  onChange
}: TextFieldProps) {
  const inputContent = (
    <input 
      type={type}
      name={name}
      className={`form-control ${formSizes(size!)}`}
      id={id}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      readOnly={readonly}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    />
  )

  return (
    <>
      {textFieldLabelContent(label!, id)}
      {inputContent}
      {textFieldTextContent(text!, id)}
    </>
  )
}
export function PasswordField({
  name,
  label,
  id = `field-${name}`,
  placeholder,
  size,
  text,
  value,
  disabled,
  readonly,
  onChange
}: TextFieldProps) {
  const [show, setShow] = useState(false)

  const inputContent = (
    <GroupField>
      <input
        name={name}
        type={show ? "text" : "password"}
        className={`form-control ${formSizes(size!)}`}
        id={id}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        readOnly={readonly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
      <span
        className="input-group-text"
        style={{ cursor: "pointer" }}
        onClick={() => setShow((v) => !v)}
        tabIndex={0}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        <i className={`bi bi-eye${show ? "-slash" : ""}`}></i>
      </span>
    </GroupField>
  )

  return (
    <>
      {textFieldLabelContent(label!, id)}
      {inputContent}
      {textFieldTextContent(text!, id)}
    </>
  )
}

type GroupFieldProps = {
  children: ReactNode
  label?: string
}
export function GroupField({
  children,
  label
}: GroupFieldProps) {
  const div = (
    <div className="input-group">
      {children}
    </div>
  )

  const conten = label
  ? <>
      <label className="form-label">
        {label}
      </label>
      {div}
    </>
  : div

  return conten
}

type GroupFieldTextProps = {
  text: string
}
export function GroupFieldText({
  text
}: GroupFieldTextProps) {
  return (
    <span className="input-group-text">
      {text}
    </span>
  )
}

type OptionProps = {
  value: string
  text: string
  selected?: boolean
  disabled?: boolean
}
export function Option({
  value,
  text,
  selected,
  disabled,
}: OptionProps) {
  return (
    <option
      value={value}
      selected={selected}
      disabled={disabled}
    >
      {text}
    </option>
  )
}

type SelectProps = {
  name: string
  options: (OptionProps | ReactNode)[]
  size?: size
  window?: number
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
}
export function Select({
  name,
  options,
  size,
  window,
  value,
  disabled,
  onChange
}: SelectProps) {
  return (
    <select
      className={`form-select ${formSizes(size!)}`}
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      {...(window ? { size: window } : {})}
    >
      {options.map((option, index) => {
        if (typeof option == "object" && option != null && "props" in (option as any)) {
          return option as ReactNode
        }

        const { value, ...rest } = option as OptionProps
        return <Option key={ index} value={value} {...rest} />
      })}
    </select>
  )
}

type CheckProps = {
  value: string
  label: string
  name: string
  id?: string
  checked?: boolean
  disabled?: boolean
  isSwitch?: boolean
  onChange?: (checked: boolean) => void
}
export function Check({
  value,
  label,
  name,
  id = `check-${name}`,
  checked,
  disabled,
  isSwitch,
  onChange
}: CheckProps) {
  const inputContent = (
    <input 
      className="form-check-input" 
      type="checkbox" 
      name={name}
      value={value} 
      id={id} 
      disabled={disabled}
      checked={checked}
      onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      {...(isSwitch ? { role: "switch" } : {})}
    />
  )

  return (
    <div className={`form-check ${isSwitch ? "form-switch" : ""}`}>
      {inputContent}
      {textFieldLabelContent(label!, id, "check")}
    </div>
  )
}

type RadioProps = {
  value: string
  label: string
  name: string
  id?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}
export function Radio({
  value,
  label,
  name,
  id = `radio-${name}`,
  checked,
  disabled,
  onChange
}: RadioProps) {
  const inputContent = (
    <input
      className="form-check-input"
      type="radio"    
      name={name}
      id={id}
      checked={checked}
      disabled={disabled}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
    />
  )

  return (
    <div className="form-check">
      {inputContent}
      {textFieldLabelContent(label!, id, "check")}
    </div>
  )
}

type RangeProps = {
  name: string
  label: string
  id?: string
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}
export function Range({
  name,
  label,
  id = `range-${name}`,
  disabled,
  min = 0,
  max = 100,
  step = 1,
  onChange
}: RangeProps) {
  const inputContent = (
    <input
      type="range"
      className="form-range"
      name={name}
      id={id}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      {...(onChange ? { onChange: (e: any) => onChange(e.target.valueAsNumber) } : {})}
    />
  )

  return (
    <>
      {textFieldLabelContent(label!, id)}
      {inputContent}
    </>
  )
}
