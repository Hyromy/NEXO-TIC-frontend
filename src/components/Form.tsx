import { 
  type ReactNode,
  useState,
} from "react"

import { getDataFromForm } from "../utils/getters"

type size = "sm" | "lg"
type textType = "text" | "password" | "area" | "number"
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
type TransformFn = (value: unknown) => string

type FieldMapperConfig = {
  path: string
  transform?: TransformFn
}

export type FieldMapper = Record<string, string | FieldMapperConfig>

const toStringValue = (value: unknown) => {
  if (value == null) return ""
  return String(value)
}

const getByPath = (source: unknown, path: string): unknown => {
  if (!source || !path) return undefined

  return path
    .split(".")
    .reduce<unknown>((acc, key) => {
      if (acc == null || typeof acc !== "object") return undefined
      return (acc as Record<string, unknown>)[key]
    }, source)
}

export const mapObjectToFormValues = <T extends object>(
  source: T | null,
  mapper: FieldMapper,
  defaults: Record<string, string> = {}
) => {
  const values: Record<string, string> = { ...defaults }

  for (const fieldName of Object.keys(mapper)) {
    const config = mapper[fieldName]
    const path = typeof config === "string" ? config : config.path
    const transform = typeof config === "string"
      ? toStringValue
      : config.transform || toStringValue

    const rawValue = source ? getByPath(source, path) : undefined
    values[fieldName] = rawValue == null ? (defaults[fieldName] || "") : transform(rawValue)
  }

  return values
}

export const setFormValues = (
  form: HTMLFormElement,
  values: Record<string, string>
) => {
  for (const fieldName of Object.keys(values)) {
    const element = form.querySelector(`[name='${fieldName}']`) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null

    if (!element) continue
    element.value = values[fieldName]
  }
}

/**
 * Form component that wraps a form element and provides a way to handle form submission. It prevents the default form submission behavior and instead calls the `onSubmit` prop with the form data as an object. The form data is extracted using the `getDataFromForm` utility function, which converts the FormData into a plain object.
 * 
 * @example
 * const handleSubmit = (data) => {
 *   if (data.username == "admin") {
 *     alert("Login successful!")
 *   } else {
 *     alert("Invalid username or password.")
 *   }
 * }
 * 
 * <Form onSubmit={handleSubmit}>
 *   <TextField 
 *     name="username"
 *     label="Username"
 *   />
 *   <Button type="submit">
 *     Submit
 *   </Button>
 * </Form>
 *
 * 
 * @param children - The form fields and other content to be rendered inside the form.
 * @param onSubmit - A callback function that is called when the form is submitted. It receives the form data as an object.
 */
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
  rows?: number
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
/**
 * TextField component that can be used to create a text input, textarea, or password field. The `type` prop determines the type of input to render: "text" for a regular text input, "password" for a password input, and "area" for a textarea. The component also supports labels, placeholder text, and additional text below the input. The `onChange` prop allows you to handle changes to the input value.
 * 
 * @example
 * <TextField
 *   name="username"
 *   label="Username"
 *   placeholder="Enter your username"
 * />
 * 
 * @param name - The name of the input field, which will be used as the key in the form data object when the form is submitted.
 * @param type - The type of input to render: "text" for a regular text input, "password" for a password input, and "area" for a textarea. The default is "text".
 * @param rows - The number of rows to display for a textarea. This prop is only applicable when `type` is set to "area".
 * @param label - The label text to display above the input field. If not provided, no label will be rendered.
 * @param id - The id of the input field, which is used to associate the label with the input. If not provided, a default id will be generated based on the `name` prop.
 * @param placeholder - The placeholder text to display inside the input field when it is empty.
 * @param size - The size of the input field, which can be "sm" for small or "lg" for large. This affects the padding and font size of the input.
 * @param text - Additional text to display below the input field, typically used for help or error messages.
 * @param value - The current value of the input field. This makes the component a controlled component, and the value should be managed by the parent component.
 * @param disabled - If true, the input field will be disabled and not editable.
 * @param readonly - If true, the input field will be read-only and not editable, but it will still be focusable and its value can be copied.
 * @param onChange - A callback function that is called when the value of the input field changes. It receives the new value as an argument.
 */
export function TextField({
  name,
  type = "text",
  rows,
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
  const rest = {
    type,
    name,
    className: `form-control ${formSizes(size!)}`,
    id,
    placeholder,
    value,
    disabled,
    readOnly: readonly,
    onChange: onChange ? (e: any) => onChange(e.target.value) : undefined
  }

  const inputContent = () => {
    if (type == "area") {
      const { type, ...restWithoutType } = rest
      return <textarea {...restWithoutType} rows={rows || 3} />
    }
    return <input {...rest} />
  }

  return (
    <>
      {textFieldLabelContent(label!, id)}
      {inputContent()}
      {textFieldTextContent(text!, id)}
    </>
  )
}

/**
 * PasswordField component that renders a password input field with a toggle button to show or hide the password. It uses the `TextField` component internally and adds a button to toggle the visibility of the password. The `onChange` prop allows you to handle changes to the input value, and the `value` prop makes it a controlled component.
 * 
 * @example
 * <PasswordField
 *   name="password"
 *   label="Password"
 *   placeholder="Enter your password"
 * />
 *
 * @param name - The name of the input field, which will be used as the key in the form data object when the form is submitted.
 * @param label - The label text to display above the input field. If not provided, no label will be rendered.
 * @param id - The id of the input field, which is used to associate the label with the input. If not provided, a default id will be generated based on the `name` prop.
 * @param placeholder - The placeholder text to display inside the input field when it is empty.
 * @param size - The size of the input field, which can be "sm" for small or "lg" for large. This affects the padding and font size of the input.
 * @param text - Additional text to display below the input field, typically used for help or error messages.
 * @param value - The current value of the input field. This makes the component a controlled component, and the value should be managed by the parent component.
 * @param disabled - If true, the input field will be disabled and not editable.
 * @param readonly - If true, the input field will be read-only and not editable, but it will still be focusable and its value can be copied.
 * @param onChange - A callback function that is called when the value of the input field changes. It receives the new value as an argument.
 */
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
/**
 * GroupField component that renders a group of input elements with a label. It is typically used to wrap input fields and their associated labels or buttons.
 * 
 * @example
 * <GroupField label="Username">
 *   <TextField name="username" />
 *   <Button>Check</Button>
 * </GroupField>
 * 
 * @param children - The input elements and other content to be rendered inside the group.
 * @param label - The label text to display above the group of inputs. If not provided, no label will be rendered. 
 */
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
/**
 * GroupFieldText component that renders a text element inside a group field. It is typically used to display static text or symbols (e.g., "@") next to input fields within a GroupField.
 * 
 * @example
 * <GroupField label="Register your site">
 *   <GroupFieldText text="https://" />
 *   <TextField name="site" />
 *   <GroupFieldText text=".com" />
 * </GroupField>
 * 
 * @param text - The text to display inside the group field. This is typically static text that provides context for the input fields, such as a prefix or suffix.
 */
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
/**
 * Option component that renders an option element for a select dropdown. It accepts props for the option's value, display text, and whether it is selected or disabled.
 * 
 * @example
 * <Option value="male" text="Man" />
 * <Option value="female" text="Woman" selected />
 * <Option value="helicopter" text="Helicopter" disabled />
 * 
 * @param value - The value of the option, which will be submitted with the form when the option is selected.
 * @param text - The display text for the option that will be shown in the dropdown menu.
 * @param selected - If true, this option will be selected by default when the dropdown is rendered.
 * @param disabled - If true, this option will be disabled and not selectable by the user.
 */
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
  label?: string
  id?: string
  size?: size
  window?: number
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
}
/**
 * Select component that renders a select dropdown with options. It accepts an array of options, which can be either plain option objects or custom React nodes (e.g., for optgroup). The component also supports different sizes, a windowed dropdown, and handling changes to the selected value.
 * 
 * @example
 * <Select
 *   name="gender"
 *   options={[
 *     { value: "male", text: "Man" },
 *     <Option value="female" text="Woman" selected />,
 *   ]}
 * />
 * 
 * @param name - The name of the select field, which will be used as the key in the form data object when the form is submitted.
 * @param options - An array of options to be rendered in the dropdown. Each option can be either an object with `value`, `text`, `selected`, and `disabled` properties, or a custom React node (e.g., for optgroup).
 * @param size - The size of the select field, which can be "sm" for small or "lg" for large. This affects the padding and font size of the select.
 * @param window - If provided, this sets the `size` attribute on the select element, which makes it a windowed dropdown that shows multiple options at once.
 * @param value - The current value of the select field. This makes the component a controlled component, and the value should be managed by the parent component.
 * @param disabled - If true, the select field will be disabled and not editable.
 * @param onChange - A callback function that is called when the selected value changes. It receives the new value as an argument.
 */
export function Select({
  name,
  options,
  label,
  id = `select-${name}`,
  size,
  window,
  value,
  disabled,
  onChange
}: SelectProps) {
  const selectContent = (
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

  return (
    <>
      {textFieldLabelContent(label!, id)}
      {selectContent}
    </>
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
/**
 * Check component that renders a checkbox or switch input. It accepts props for the checkbox's value, label, name, and whether it is checked or disabled. The `isSwitch` prop determines whether to render a regular checkbox or a switch-style toggle. The `onChange` prop allows you to handle changes to the checked state.
 * 
 * @example
 * <Check
 *   value="accept"
 *   label="I accept the terms and conditions"
 *   name="terms"
 *   isSwitch
 * />
 * 
 * @param value - The value of the checkbox, which will be submitted with the form when the checkbox is checked.
 * @param label - The label text to display next to the checkbox.
 * @param name - The name of the checkbox field, which will be used as the key in the form data object when the form is submitted.
 * @param id - The id of the checkbox input, which is used to associate the label with the input. If not provided, a default id will be generated based on the `name` prop.
 * @param checked - If true, the checkbox will be checked by default when rendered.
 * @param disabled - If true, the checkbox will be disabled and not editable by the user.
 * @param isSwitch - If true, the component will render a switch-style toggle instead of a regular checkbox.
 * @param onChange - A callback function that is called when the checked state of the checkbox changes. It receives the new checked state (true or false) as an argument.
 */
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
/**
 * Radio component that renders a radio button input. It accepts props for the radio button's value, label, name, and whether it is checked or disabled. The `onChange` prop allows you to handle changes to the checked state of the radio button.
 * 
 * @example
 * <Radio
 *   value="option1"
 *   label="Option 1"
 *   name="options"
 * />
 * <Radio
 *   value="option2"
 *   label="Option 2"
 *   name="options"
 *   checked
 * />
 * 
 * @param value - The value of the radio button, which will be submitted with the form when the radio button is selected.
 * @param label - The label text to display next to the radio button.
 * @param name - The name of the radio button group, which will be used as the key in the form data object when the form is submitted. All radio buttons with the same `name` belong to the same group, and only one can be selected at a time.
 * @param id - The id of the radio button input, which is used to associate the label with the input. If not provided, a default id will be generated based on the `name` prop.
 * @param checked - If true, the radio button will be selected by default when rendered.
 * @param disabled - If true, the radio button will be disabled and not editable by the user.
 * @param onChange - A callback function that is called when the checked state of the radio button changes. It receives the new checked state (true or false) as an argument.
 */
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
/**
 * Range component that renders a range input (slider). It accepts props for the range's name, label, id, disabled state, minimum and maximum values, step size, and a change handler. The `onChange` prop allows you to handle changes to the slider's value, which is passed as a number.
 * 
 * @example
 * <Range
 *   name="volume"
 *   label="Volume"
 *   onChange={(value) => console.log("Volume changed to:", value)}
 * />
 * 
 * @param name - The name of the range field, which will be used as the key in the form data object when the form is submitted.
 * @param label - The label text to display above the range input.
 * @param id - The id of the range input, which is used to associate the label with the input. If not provided, a default id will be generated based on the `name` prop.
 * @param disabled - If true, the range input will be disabled and not editable by the user.
 * @param min - The minimum value of the range slider. The default is 0.
 * @param max - The maximum value of the range slider. The default is 100.
 * @param step - The step size for the range slider. The default is 1.
 * @param onChange - A callback function that is called when the value of the range slider changes. It receives the new value as a number argument.
 */
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
