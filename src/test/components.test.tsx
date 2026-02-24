import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const { mockShow, mockHide, mockGetOrCreateInstance, mockDispose } = vi.hoisted(() => {
  const mockShow = vi.fn()
  const mockHide = vi.fn()
  const mockDispose = vi.fn()
  const mockGetOrCreateInstance = vi.fn(() => ({ show: mockShow, hide: mockHide }))
  return { mockShow, mockHide, mockGetOrCreateInstance, mockDispose }
})

vi.mock('bootstrap', () => {
  function MockClass(this: Record<string, unknown>) {
    this.show = mockShow
    this.hide = mockHide
    this.dispose = mockDispose
  }
  (MockClass as unknown as { getOrCreateInstance: typeof mockGetOrCreateInstance }).getOrCreateInstance = mockGetOrCreateInstance
  return {
    Modal:   { getOrCreateInstance: mockGetOrCreateInstance },
    Toast:   MockClass,
    Tooltip: MockClass,
    Popover: MockClass,
  }
})

import { Button, ButtonGroup } from "../components/Button"
import { Accordion } from "../components/Accordion"
import { Alert, AlertLink, launchAlert } from "../components/Alert"
import { Badge } from "../components/Badge"
import { Breadcrumb } from "../components/Breadcrumb"
import { Canvas } from "../components/Canvas"
import { Card } from "../components/Card"
import { Dropdown, DropdownDivider } from "../components/Dropdown"
import { 
  Form, 
  TextField, 
  PasswordField, 
  GroupField, 
  GroupFieldText, 
  Select, 
  Option,
  Check,
  Radio,
  Range
} from "../components/Form"
import { List, ListItem } from "../components/List"
import { Modal, openModal, closeModal } from "../components/Modal"
import Progress, { ProgressStack } from "../components/Progress"
import { Spinner } from "../components/Spinner"
import { Toast, ToastContainer, showToast, hideToast } from "../components/Toast"
import { Tooltip } from "../components/Tooltip"
import { Popover } from "../components/Popover"

describe("Components package", () => {
  describe('Accordion Component', () => {
    it('should render accordion with items', () => {
      const items = [
        { header: 'Item 1', body: 'Content 1' },
        { header: 'Item 2', body: 'Content 2' }
      ]
      render(<Accordion items={items} />)
      
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('should use custom id', () => {
      const items = [{ header: 'Header', body: 'Body' }]
      const { container } = render(<Accordion items={items} id="custom-accordion" />)
      
      expect(container.querySelector('#custom-accordion')).toBeInTheDocument()
    })

    it('should render empty accordion with empty items array', () => {
      const { container } = render(<Accordion items={[]} />)
      expect(container.querySelector('.accordion')).toBeInTheDocument()
    })

    it('should apply flush class when flush is true', () => {
      const { container } = render(<Accordion items={[]} flush />)
      expect(container.querySelector('.accordion-flush')).toBeInTheDocument()
    })

    it('should open item at openIndex', () => {
      const items = [
        { header: 'Item 1', body: 'Body 1' },
        { header: 'Item 2', body: 'Body 2' },
      ]
      const { container } = render(<Accordion items={items} openIndex={1} />)
      const buttons = container.querySelectorAll('.accordion-button')
      expect(buttons[0]).toHaveClass('collapsed')
      expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
      expect(buttons[1]).not.toHaveClass('collapsed')
      expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')
    })

    it('should collapse all items by default (openIndex=-1)', () => {
      const items = [{ header: 'H1', body: 'B1' }, { header: 'H2', body: 'B2' }]
      const { container } = render(<Accordion items={items} />)
      const buttons = container.querySelectorAll('.accordion-button')
      buttons.forEach(btn => {
        expect(btn).toHaveClass('collapsed')
        expect(btn).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('should throw when openIndex >= items.length', () => {
      const items = [{ header: 'H1', body: 'B1' }]
      expect(() => render(<Accordion items={items} openIndex={5} />)).toThrow()
    })
  })

  describe('Alert Component', () => {
    it('should render alert with children', () => {
      render(<Alert>This is an alert</Alert>)
      expect(screen.getByRole('alert')).toHaveTextContent('This is an alert')
    })

    it('should render with default primary type', () => {
      render(<Alert>Primary alert</Alert>)
      expect(screen.getByRole('alert')).toHaveClass('alert-primary')
    })

    it('should apply different variant types', () => {
      const { rerender } = render(<Alert type="danger">Alert</Alert>)
      expect(screen.getByRole('alert')).toHaveClass('alert-danger')

      rerender(<Alert type="success">Alert</Alert>)
      expect(screen.getByRole('alert')).toHaveClass('alert-success')
    })

    it('should be dismissible by default', () => {
      render(<Alert>Alert</Alert>)
      expect(screen.getByRole('alert')).toHaveClass('alert-dismissible')
      expect(screen.getByLabelText('Close')).toBeInTheDocument()
    })

    it('should not be dismissible when notDismissible is true', () => {
      const { container } = render(<Alert notDismissible>Alert</Alert>)
      expect(container.querySelector('.alert-dismissible')).not.toBeInTheDocument()
      expect(container.querySelector('.btn-close')).not.toBeInTheDocument()
    })

    it('should render icon when icon prop is provided', () => {
      const { container } = render(<Alert icon="success">Alert</Alert>)
      expect(container.querySelector('.bi-check-circle-fill')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('d-flex', 'align-items-center')
    })

    it('should render correct icon for each type', () => {
      const { container: c1, rerender } = render(<Alert icon="info">A</Alert>)
      expect(c1.querySelector('.bi-info-circle-fill')).toBeInTheDocument()

      rerender(<Alert icon="warning">A</Alert>)
      expect(document.querySelector('.bi-exclamation-triangle-fill')).toBeInTheDocument()

      rerender(<Alert icon="error">A</Alert>)
      expect(document.querySelector('.bi-x-circle-fill')).toBeInTheDocument()
    })
  })

  describe('AlertLink Component', () => {
    it('should render link with text', () => {
      render(<AlertLink text="Click here" />)
      expect(screen.getByText('Click here')).toBeInTheDocument()
    })

    it('should have alert-link class', () => {
      render(<AlertLink text="Link" />)
      expect(screen.getByRole('link')).toHaveClass('alert-link')
    })

    it('should use default href #', () => {
      render(<AlertLink text="Link" />)
      expect(screen.getByRole('link')).toHaveAttribute('href', '#')
    })

    it('should use custom href', () => {
      render(<AlertLink text="Link" href="/about" />)
      expect(screen.getByRole('link')).toHaveAttribute('href', '/about')
    })

    it('should open in new tab when newWindow is true', () => {
      render(<AlertLink text="Link" newWindow />)
      expect(screen.getByRole('link')).toHaveAttribute('target', '_blank')
    })
  })

  describe('launchAlert', () => {
    let container: HTMLDivElement

    beforeEach(() => {
      container = document.createElement('div')
      container.id = 'alert-container'
      document.body.appendChild(container)
    })

    afterEach(() => {
      container.remove()
    })

    it('should throw if container not found', () => {
      expect(() => launchAlert('non-existent', <Alert>msg</Alert>)).toThrow()
    })

    it('should throw if element is not an Alert', () => {
      expect(() => launchAlert('alert-container', <div>not an alert</div>)).toThrow()
    })

    it('should append alert to container', () => {
      act(() => {
        launchAlert('alert-container', <Alert>Hello</Alert>)
      })
      expect(container.children.length).toBeGreaterThan(0)
    })
  })

  describe('Badge Component', () => {
    it('should render badge with text', () => {
      render(<Badge text="New" />)
      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('should render with default primary type', () => {
      render(<Badge text="Badge" />)
      expect(screen.getByText('Badge')).toHaveClass('bg-primary')
    })

    it('should render pill when pill is true', () => {
      render(<Badge text="Pill" pill />)
      expect(screen.getByText('Pill')).toHaveClass('rounded-pill')
    })

    it('should render position classes when onTop is true', () => {
      render(<Badge text="Top" onTop />)
      const badge = screen.getByText('Top')
      expect(badge).toHaveClass('position-absolute', 'top-0', 'start-100', 'translate-middle')
    })

    it('should render visually-hidden text when hidden is provided', () => {
      render(<Badge text="99" hidden="unread messages" />)
      expect(screen.getByText('unread messages')).toHaveClass('visually-hidden')
    })

    it('should render non-breaking space when no text is provided', () => {
      const { container } = render(<Badge />)
      expect(container.querySelector('.badge')).toBeInTheDocument()
    })

    it('should apply different variant types', () => {
      const { rerender } = render(<Badge text="Badge" type="warning" />)
      expect(screen.getByText('Badge')).toHaveClass('bg-warning')

      rerender(<Badge text="Badge" type="info" />)
      expect(screen.getByText('Badge')).toHaveClass('bg-info')
    })
  })

  describe('Breadcrumb Component', () => {
    it('should render breadcrumb items', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Library', href: '/library' },
        { label: 'Data', href: '/data' }
      ]
      render(<Breadcrumb items={items} />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Library')).toBeInTheDocument()
      expect(screen.getByText('Data')).toBeInTheDocument()
    })

    it('should mark last item as active', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current', href: '/current' }
      ]
      const { container } = render(<Breadcrumb items={items} />)
      const breadcrumbItems = container.querySelectorAll('.breadcrumb-item')
      
      expect(breadcrumbItems[breadcrumbItems.length - 1]).toHaveClass('active')
    })

    it('should render links for non-last items', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current', href: '/current' }
      ]
      render(<Breadcrumb items={items} />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should apply custom divider via CSS variable', () => {
      const items = [{ label: 'Home', href: '/' }, { label: 'Page', href: '/page' }]
      const { container } = render(<Breadcrumb items={items} divider=">" />)
      const nav = container.querySelector('nav')
      expect(nav).toHaveStyle({ '--bs-breadcrumb-divider': "'>'" })
    })

    it('should remove divider when empty string is passed', () => {
      const items = [{ label: 'Home', href: '/' }, { label: 'Page', href: '/page' }]
      const { container } = render(<Breadcrumb items={items} divider="" />)
      const nav = container.querySelector('nav')
      expect(nav).toHaveStyle({ '--bs-breadcrumb-divider': "''" })
    })
  })

  describe('Button Component', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('should render with default props', () => {
      render(<Button>Default Button</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveClass('btn', 'btn-primary')
    })

    it('should apply variant class correctly', () => {
      render(<Button variant="success">Success Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('btn-success')
    })

    it('should apply fat class when fat prop is true', () => {
      render(<Button fat>Fat Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('w-100')
    })

    it('should apply disabled class when isLoading is true', () => {
      render(<Button isLoading>Loading Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('disabled')
    })

    it('should handle click events', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Clickable</Button>)
      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should render with submit type', () => {
      render(<Button type="submit">Submit</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('should combine multiple props correctly', () => {
      render(
        <Button variant="danger" fat isLoading>
          Complex Button
        </Button>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('btn', 'btn-danger', 'w-100', 'disabled')
    })
  })

  describe('ButtonGroup Component', () => {
    it('should render button group with children', () => {
      render(
        <ButtonGroup>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>
      )
      
      expect(screen.getByText('Button 1')).toBeInTheDocument()
      expect(screen.getByText('Button 2')).toBeInTheDocument()
    })

    it('should have correct group role', () => {
      const { container } = render(
        <ButtonGroup>
          <Button>Button</Button>
        </ButtonGroup>
      )
      
      expect(container.querySelector('[role="group"]')).toBeInTheDocument()
    })
  })

  describe('Canvas Component', () => {
    it('should render canvas with title', () => {
      render(<Canvas id="c1" title="My Canvas" />)
      expect(screen.getByText('My Canvas')).toBeInTheDocument()
    })

    it('should render children content', () => {
      render(
        <Canvas id="c2" title="Canvas">
          <p>Canvas content</p>
        </Canvas>
      )
      expect(screen.getByText('Canvas content')).toBeInTheDocument()
    })

    it('should use custom id', () => {
      const { container } = render(<Canvas title="Canvas" id="custom-canvas" />)
      expect(container.querySelector('#custom-canvas')).toBeInTheDocument()
    })

    it('should have close button', () => {
      render(<Canvas id="c3" title="Canvas" />)
      expect(screen.getByLabelText('Close')).toBeInTheDocument()
    })
  })

  describe('Card Component', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should render header when provided', () => {
      render(<Card header="Card Header">Content</Card>)
      expect(screen.getByText('Card Header')).toBeInTheDocument()
    })

    it('should render footer when provided', () => {
      render(<Card footer="Card Footer">Content</Card>)
      expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })

    it('should apply shadow class when shadow prop is true', () => {
      const { container } = render(<Card shadow>Content</Card>)
      expect(container.querySelector('.shadow')).toBeInTheDocument()
    })

    it('should apply custom padding', () => {
      const { container } = render(<Card padding={2}>Content</Card>)
      expect(container.querySelector('.p-2')).toBeInTheDocument()
    })

    it('should use default padding of 4', () => {
      const { container } = render(<Card>Content</Card>)
      expect(container.querySelector('.p-4')).toBeInTheDocument()
    })
  })

  describe('Dropdown Component', () => {
    it('should render dropdown with button text', () => {
      render(<Dropdown items={[]}>Dropdown Button</Dropdown>)
      expect(screen.getByText('Dropdown Button')).toBeInTheDocument()
    })

    it('should render dropdown items', () => {
      const items = ['Item 1', 'Item 2', 'Item 3']
      render(<Dropdown items={items}>Dropdown</Dropdown>)
      
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('should apply variant to button', () => {
      render(<Dropdown variant="danger" items={[]}>Dropdown</Dropdown>)
      expect(screen.getByRole('button')).toHaveClass('btn-danger')
    })

    it('should apply direction class', () => {
      const { container } = render(<Dropdown direction="up" items={[]}>Dropdown</Dropdown>)
      expect(container.querySelector('.dropup')).toBeInTheDocument()
    })

    it('should apply inverted class to menu', () => {
      const { container } = render(<Dropdown inverted items={['Item']}>Dropdown</Dropdown>)
      expect(container.querySelector('.dropdown-menu-end')).toBeInTheDocument()
    })

    it('should render dropdown divider', () => {
      const items = ['Item 1', <DropdownDivider key="div" />, 'Item 2']
      const { container } = render(<Dropdown items={items}>Dropdown</Dropdown>)
      
      expect(container.querySelector('.dropdown-divider')).toBeInTheDocument()
    })
  })

  describe('Form Component', () => {
    it('should render form with children', () => {
      render(
        <Form onSubmit={vi.fn()}>
          <button type="submit">Submit</button>
        </Form>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should call onSubmit with form data', async () => {
      const handleSubmit = vi.fn()
      const user = userEvent.setup()
      
      render(
        <Form onSubmit={handleSubmit}>
          <input name="username" defaultValue="testuser" />
          <button type="submit">Submit</button>
        </Form>
      )
      
      await user.click(screen.getByRole('button'))
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('should prevent default form submission', async () => {
      const handleSubmit = vi.fn()
      const user = userEvent.setup()
      
      render(
        <Form onSubmit={handleSubmit}>
          <button type="submit">Submit</button>
        </Form>
      )
      
      await user.click(screen.getByRole('button'))
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('TextField Component', () => {
    it('should render text field with name', () => {
      render(<TextField name="username" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'username')
    })

    it('should render with label', () => {
      render(<TextField name="email" label="Email Address" />)
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<TextField name="username" placeholder="Enter username" />)
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    })

    it('should render with help text', () => {
      render(<TextField name="password" text="Must be 8 characters" />)
      expect(screen.getByText('Must be 8 characters')).toBeInTheDocument()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<TextField name="field" disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should be readonly when readonly prop is true', () => {
      render(<TextField name="field" readonly />)
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    })

    it('should handle onChange events', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<TextField name="field" onChange={handleChange} />)
      await user.type(screen.getByRole('textbox'), 'test')
      
      expect(handleChange).toHaveBeenCalled()
    })

    it('should render as password type', () => {
      const { container } = render(<TextField name="password" type="password" />)
      const input = container.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
    })
  })

  describe('PasswordField Component', () => {
    it('should render password field', () => {
      const { container } = render(<PasswordField name="password" />)
      const input = container.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
    })

    it('should toggle password visibility', async () => {
      const user = userEvent.setup()
      const { container } = render(<PasswordField name="password" />)
      
      const toggleButton = screen.getByLabelText('Mostrar contraseña')
      await user.click(toggleButton)
      
      const input = container.querySelector('input[type="text"]')
      expect(input).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<PasswordField name="password" label="Password" />)
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
    })
  })

  describe('GroupField Component', () => {
    it('should render children in input group', () => {
      render(
        <GroupField>
          <input type="text" />
        </GroupField>
      )
      const { container } = render(<GroupField><input /></GroupField>)
      expect(container.querySelector('.input-group')).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(
        <GroupField label="Username">
          <input type="text" />
        </GroupField>
      )
      expect(screen.getByText('Username')).toBeInTheDocument()
    })
  })

  describe('GroupFieldText Component', () => {
    it('should render text in input group', () => {
      render(<GroupFieldText text="@" />)
      expect(screen.getByText('@')).toBeInTheDocument()
    })
  })

  describe('Select Component', () => {
    it('should render select with options', () => {
      const options = [
        { value: '1', text: 'Option 1' },
        { value: '2', text: 'Option 2' }
      ]
      render(<Select name="country" options={options} />)
      
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Select name="select" options={[]} disabled />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('should handle onChange events', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      const options = [
        { value: '1', text: 'Option 1' },
        { value: '2', text: 'Option 2' }
      ]
      
      render(<Select name="select" options={options} onChange={handleChange} />)
      await user.selectOptions(screen.getByRole('combobox'), '2')
      
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Option Component', () => {
    it('should render option with value and text', () => {
      render(
        <select>
          <Option value="1" text="Option 1" />
        </select>
      )
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })
  })

  describe('Check Component', () => {
    it('should render checkbox with label', () => {
      render(<Check name="agree" value="yes" label="I agree" />)
      expect(screen.getByLabelText('I agree')).toBeInTheDocument()
    })

    it('should be checked when checked prop is true', () => {
      render(<Check name="check" value="yes" label="Check" checked onChange={() => {}} />)
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Check name="check" value="yes" label="Check" disabled />)
      expect(screen.getByRole('checkbox')).toBeDisabled()
    })

    it('should render as switch when isSwitch is true', () => {
      render(<Check name="switch" value="yes" label="Switch" isSwitch />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    it('should handle onChange events', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Check name="check" value="yes" label="Check" onChange={handleChange} />)
      await user.click(screen.getByRole('checkbox'))
      
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Radio Component', () => {
    it('should render radio with label', () => {
      render(<Radio name="option" value="1" label="Option 1" />)
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
    })

    it('should be checked when checked prop is true', () => {
      render(<Radio name="radio" value="yes" label="Radio" checked onChange={() => {}} />)
      expect(screen.getByRole('radio')).toBeChecked()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Radio name="radio" value="yes" label="Radio" disabled />)
      expect(screen.getByRole('radio')).toBeDisabled()
    })

    it('should handle onChange events', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Radio name="radio" value="yes" label="Radio" onChange={handleChange} />)
      await user.click(screen.getByRole('radio'))
      
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Range Component', () => {
    it('should render range with label', () => {
      render(<Range name="volume" label="Volume" />)
      expect(screen.getByLabelText('Volume')).toBeInTheDocument()
    })

    it('should have default min, max, and step values', () => {
      render(<Range name="range" label="Range" />)
      const range = screen.getByRole('slider')
      
      expect(range).toHaveAttribute('min', '0')
      expect(range).toHaveAttribute('max', '100')
      expect(range).toHaveAttribute('step', '1')
    })

    it('should accept custom min, max, and step values', () => {
      render(<Range name="range" label="Range" min={10} max={50} step={5} />)
      const range = screen.getByRole('slider')
      
      expect(range).toHaveAttribute('min', '10')
      expect(range).toHaveAttribute('max', '50')
      expect(range).toHaveAttribute('step', '5')
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Range name="range" label="Range" disabled />)
      expect(screen.getByRole('slider')).toBeDisabled()
    })
  })

  describe('List Component', () => {
    it('should render list with items', () => {
      const items = ['Item 1', 'Item 2', 'Item 3']
      render(<List items={items} />)
      
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('should render empty list with empty array', () => {
      const { container } = render(<List items={[]} />)
      expect(container.querySelector('.list-group')).toBeInTheDocument()
    })

    it('should render ReactNode items', () => {
      const items = [<strong key="1">Bold Item</strong>, <em key="2">Italic Item</em>]
      render(<List items={items} />)
      
      expect(screen.getByText('Bold Item')).toBeInTheDocument()
      expect(screen.getByText('Italic Item')).toBeInTheDocument()
    })

    it('should apply flush class', () => {
      const { container } = render(<List items={[]} flush />)
      expect(container.querySelector('.list-group-flush')).toBeInTheDocument()
    })

    it('should apply numbered class', () => {
      const { container } = render(<List items={[]} numbered />)
      expect(container.querySelector('.list-group-numbered')).toBeInTheDocument()
    })

    it('should apply horizontal class', () => {
      const { container } = render(<List items={[]} horizontal />)
      expect(container.querySelector('.list-group-horizontal')).toBeInTheDocument()
    })
  })

  describe('Modal Component', () => {
    it('should render modal with children', () => {
      render(<Modal>Modal content</Modal>)
      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    it('should render header when provided', () => {
      render(<Modal header="Modal Title">Content</Modal>)
      expect(screen.getByText('Modal Title')).toBeInTheDocument()
    })

    it('should render footer when provided', () => {
      render(<Modal footer="Modal Footer">Content</Modal>)
      expect(screen.getByText('Modal Footer')).toBeInTheDocument()
    })

    it('should use custom id', () => {
      const { container } = render(<Modal id="custom-modal">Content</Modal>)
      expect(container.querySelector('#custom-modal')).toBeInTheDocument()
    })

    it('should have close button', () => {
      render(<Modal>Content</Modal>)
      expect(screen.getByLabelText('Close')).toBeInTheDocument()
    })

    it('should apply static backdrop when isStatic is true', () => {
      const { container } = render(<Modal isStatic>Content</Modal>)
      const modalEl = container.querySelector('.modal')
      expect(modalEl).toHaveAttribute('data-bs-backdrop', 'static')
      expect(modalEl).toHaveAttribute('data-bs-keyboard', 'false')
    })

    it('should not have static attributes when isStatic is false', () => {
      const { container } = render(<Modal>Content</Modal>)
      const modalEl = container.querySelector('.modal')
      expect(modalEl).not.toHaveAttribute('data-bs-backdrop')
      expect(modalEl).not.toHaveAttribute('data-bs-keyboard')
    })

    it('should apply size class when size prop is provided', () => {
      const { container: containerSm } = render(<Modal size="sm">Content</Modal>)
      expect(containerSm.querySelector('.modal-dialog')).toHaveClass('modal-sm')

      const { container: containerLg } = render(<Modal size="lg">Content</Modal>)
      expect(containerLg.querySelector('.modal-dialog')).toHaveClass('modal-lg')

      const { container: containerXl } = render(<Modal size="xl">Content</Modal>)
      expect(containerXl.querySelector('.modal-dialog')).toHaveClass('modal-xl')
    })

    it('should not have size class when size prop is not provided', () => {
      const { container } = render(<Modal>Content</Modal>)
      const dialog = container.querySelector('.modal-dialog')
      expect(dialog?.className).toBe('modal-dialog')
    })

    it('openModal should call BSModal.getOrCreateInstance().show()', () => {
      mockShow.mockClear()
      mockGetOrCreateInstance.mockClear()

      const { container } = render(<Modal id="test-open-modal">Content</Modal>)
      const el = container.querySelector('#test-open-modal') as HTMLElement

      openModal('test-open-modal')
      expect(mockGetOrCreateInstance).toHaveBeenCalledWith(el)
      expect(mockShow).toHaveBeenCalled()
    })

    it('closeModal should call BSModal.getOrCreateInstance().hide()', () => {
      mockHide.mockClear()
      mockGetOrCreateInstance.mockClear()

      const { container } = render(<Modal id="test-close-modal">Content</Modal>)
      const el = container.querySelector('#test-close-modal') as HTMLElement

      closeModal('test-close-modal')
      expect(mockGetOrCreateInstance).toHaveBeenCalledWith(el)
      expect(mockHide).toHaveBeenCalled()
    })

    it('openModal should do nothing if element does not exist', () => {
      mockGetOrCreateInstance.mockClear()
      openModal('non-existent-modal')
      expect(mockGetOrCreateInstance).not.toHaveBeenCalled()
    })

    it('closeModal should do nothing if element does not exist', () => {
      mockGetOrCreateInstance.mockClear()
      closeModal('non-existent-modal')
      expect(mockGetOrCreateInstance).not.toHaveBeenCalled()
    })
  })

  describe('Progress Component', () => {
    it('should render progress bar with value', () => {
      const { container } = render(<Progress value={50} />)
      const progressBar = container.querySelector('.progress-bar')
      expect(progressBar).toHaveStyle({ width: '50%' })
    })

    it('should use default max value of 100', () => {
      const { container } = render(<Progress value={75} />)
      const progressBar = container.querySelector('.progress-bar')
      expect(progressBar).toHaveStyle({ width: '75%' })
    })

    it('should calculate percentage with custom max', () => {
      const { container } = render(<Progress value={50} max={200} />)
      const progressBar = container.querySelector('.progress-bar')
      expect(progressBar).toHaveStyle({ width: '25%' })
    })

    it('should apply variant class', () => {
      const { container } = render(<Progress value={50} variant="success" />)
      expect(container.querySelector('.bg-success')).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<Progress value={50} label="50%" />)
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('should apply striped class when striped is true', () => {
      const { container } = render(<Progress value={50} striped />)
      expect(container.querySelector('.progress-bar-striped')).toBeInTheDocument()
    })

    it('should apply animated class when animated is true', () => {
      const { container } = render(<Progress value={50} animated />)
      expect(container.querySelector('.progress-bar-animated')).toBeInTheDocument()
    })

    it('should clamp percentage between 0 and 100', () => {
      const { container, rerender } = render(<Progress value={150} />)
      let progressBar = container.querySelector('.progress-bar')
      expect(progressBar).toHaveStyle({ width: '100%' })

      rerender(<Progress value={-50} />)
      progressBar = container.querySelector('.progress-bar')
      expect(progressBar).toHaveStyle({ width: '0%' })
    })
  })

  describe('Spinner Component', () => {
    it('should render spinner with default border type', () => {
      const { container } = render(<Spinner />)
      expect(container.querySelector('.spinner-border')).toBeInTheDocument()
    })

    it('should render growing spinner when growing is true', () => {
      const { container } = render(<Spinner growing />)
      expect(container.querySelector('.spinner-grow')).toBeInTheDocument()
    })

    it('should apply variant class', () => {
      const { container } = render(<Spinner variant="primary" />)
      expect(container.querySelector('.text-primary')).toBeInTheDocument()
    })

    it('should render small spinner when small is true', () => {
      const { container } = render(<Spinner small />)
      expect(container.querySelector('.spinner-border-sm')).toBeInTheDocument()
    })

    it('should render with custom label', () => {
      render(<Spinner label="Loading data..." />)
      expect(screen.getByText('Loading data...')).toBeInTheDocument()
    })

    it('should render with default label', () => {
      render(<Spinner />)
      expect(screen.getByText('Cargando...')).toBeInTheDocument()
    })
  })

  describe('Toast Component', () => {
    it('should render toast with children', () => {
      render(<Toast id="t1">Toast message</Toast>)
      expect(screen.getByText('Toast message')).toBeInTheDocument()
    })

    it('should apply variant class when variant provided without header', () => {
      const { container } = render(<Toast id="t2" variant="success">Success!</Toast>)
      expect(container.querySelector('.text-bg-success')).toBeInTheDocument()
    })

    it('should render close button with white style when variant is set', () => {
      render(<Toast id="t3" variant="danger">Danger!</Toast>)
      expect(screen.getByLabelText('Close')).toHaveClass('btn-close-white')
    })

    it('should have correct role', () => {
      render(<Toast id="t4">Message</Toast>)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should render header when header prop is provided', () => {
      render(<Toast id="t5" header={<strong>Title</strong>}>Body</Toast>)
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(document.querySelector('.toast-header')).toBeInTheDocument()
    })

    it('should render action buttons when no header and no variant', () => {
      render(<Toast id="t6">Message</Toast>)
      expect(screen.getByText('Take action')).toBeInTheDocument()
    })

    it('should NOT render action buttons when header is provided', () => {
      render(<Toast id="t7" header={<span>Header</span>}>Body</Toast>)
      expect(screen.queryByText('Take action')).not.toBeInTheDocument()
    })

    it('should use custom id', () => {
      const { container } = render(<Toast id="my-toast">Msg</Toast>)
      expect(container.querySelector('#my-toast')).toBeInTheDocument()
    })
  })

  describe('ToastContainer Component', () => {
    it('should render children', () => {
      render(
        <ToastContainer>
          <Toast id="tc1">Toast 1</Toast>
        </ToastContainer>
      )
      expect(screen.getByText('Toast 1')).toBeInTheDocument()
    })

    it('should apply position class', () => {
      const { container } = render(
        <ToastContainer position="top-start">
          <Toast id="tc2">Msg</Toast>
        </ToastContainer>
      )
      expect(container.querySelector('.top-start')).toBeInTheDocument()
    })

    it('should use default position bottom-end', () => {
      const { container } = render(
        <ToastContainer>
          <Toast id="tc3">Msg</Toast>
        </ToastContainer>
      )
      expect(container.querySelector('.bottom-end')).toBeInTheDocument()
    })

    it('should have position-fixed class', () => {
      const { container } = render(
        <ToastContainer>
          <Toast id="tc4">Msg</Toast>
        </ToastContainer>
      )
      expect(container.querySelector('.position-fixed')).toBeInTheDocument()
    })
  })

  describe('showToast / hideToast', () => {
    beforeEach(() => {
      mockShow.mockClear()
      mockHide.mockClear()
      mockGetOrCreateInstance.mockClear()
    })

    it('showToast should call getOrCreateInstance().show()', () => {
      const { container } = render(<Toast id="st1">Msg</Toast>)
      const el = container.querySelector('#st1') as HTMLElement
      showToast('st1')
      expect(mockGetOrCreateInstance).toHaveBeenCalledWith(el)
      expect(mockShow).toHaveBeenCalled()
    })

    it('hideToast should call getOrCreateInstance().hide()', () => {
      const { container } = render(<Toast id="ht1">Msg</Toast>)
      const el = container.querySelector('#ht1') as HTMLElement
      hideToast('ht1')
      expect(mockGetOrCreateInstance).toHaveBeenCalledWith(el)
      expect(mockHide).toHaveBeenCalled()
    })

    it('showToast should throw if element not found', () => {
      expect(() => showToast('non-existent-toast')).toThrow()
    })

    it('hideToast should throw if element not found', () => {
      expect(() => hideToast('non-existent-toast')).toThrow()
    })
  })

  describe('List Component - ListItem', () => {
    it('should render ListItem with children', () => {
      render(<ul><ListItem>Item content</ListItem></ul>)
      expect(screen.getByText('Item content')).toBeInTheDocument()
    })

    it('should apply variant class', () => {
      const { container } = render(<ul><ListItem variant="success">Item</ListItem></ul>)
      expect(container.querySelector('.list-group-item-success')).toBeInTheDocument()
    })

    it('should apply active class', () => {
      const { container } = render(<ul><ListItem active>Item</ListItem></ul>)
      expect(container.querySelector('.active')).toBeInTheDocument()
    })

    it('should apply action class when hover is true', () => {
      const { container } = render(<ul><ListItem hover>Item</ListItem></ul>)
      expect(container.querySelector('.list-group-item-action')).toBeInTheDocument()
    })

    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      render(<ul><ListItem onClick={handleClick}>Item</ListItem></ul>)
      await user.click(screen.getByText('Item'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('List should render ListItem directly without double wrapping', () => {
      const { container } = render(
        <List items={[<ListItem key="1" variant="danger">Direct</ListItem>]} />
      )
      const items = container.querySelectorAll('.list-group-item')
      expect(items.length).toBe(1)
      expect(items[0]).toHaveClass('list-group-item-danger')
    })
  })

  describe('ProgressStack Component', () => {
    it('should render progress-stacked container', () => {
      const { container } = render(
        <ProgressStack>
          <Progress value={50} />
        </ProgressStack>
      )
      expect(container.querySelector('.progress-stacked')).toBeInTheDocument()
    })

    it('should set width on outer .progress div when stacked', () => {
      const { container } = render(
        <ProgressStack>
          <Progress value={30} />
          <Progress value={50} />
        </ProgressStack>
      )
      const progressDivs = container.querySelectorAll('.progress')
      expect(progressDivs[0]).toHaveStyle({ width: '30%' })
      expect(progressDivs[1]).toHaveStyle({ width: '50%' })
    })

    it('should not set width on inner .progress-bar when stacked', () => {
      const { container } = render(
        <ProgressStack>
          <Progress value={40} />
        </ProgressStack>
      )
      const bar = container.querySelector('.progress-bar')
      expect(bar).not.toHaveAttribute('style')
    })
  })

  describe('Tooltip Component', () => {
    it('should render children', () => {
      render(<Tooltip title="Tip"><button>Hover me</button></Tooltip>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should wrap children in a span', () => {
      const { container } = render(<Tooltip title="Tip"><button>Btn</button></Tooltip>)
      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.querySelector('button')).toBeInTheDocument()
    })
  })

  describe('Popover Component', () => {
    it('should render children', () => {
      render(<Popover content="Content"><button>Click me</button></Popover>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should wrap children in a span', () => {
      const { container } = render(<Popover content="Content"><button>Btn</button></Popover>)
      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.querySelector('button')).toBeInTheDocument()
    })

    it('should render with default placement top', () => {
      const { container } = render(<Popover content="Info"><span>Trigger</span></Popover>)
      expect(container.querySelector('span')).toBeInTheDocument()
    })
  })
})
