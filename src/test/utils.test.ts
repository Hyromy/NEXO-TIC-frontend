import { describe, it, expect, beforeEach } from "vitest"
import { getDataFromForm, getHumanName, getTheme } from "../utils/getters"
import { setTheme } from "../utils/setters"
import * as validator from "../utils/validator"
import { parseEmployee } from "../utils/parser"
import type { department, employee, jobPosition, user } from "../services/nexotic"

describe("Utils package", () => {
  describe("getters.ts", () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it("should get data from form", () => {
      const formData = new FormData()
      formData.append("username", "testuser")
      formData.append("password", "testpass")

      const data = getDataFromForm(formData)

      expect(data).toEqual({
        username: "testuser",
        password: "testpass",
      })
    })

    describe('getHumanName', () => {
      it('should return full name when first_name and last_name exist', () => {
        const mockPayload = {
          user_id: 1,
          username: 'johndoe',
          first_name: 'John',
          last_name: 'Doe'
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const humanName = getHumanName()
        expect(humanName).toBe('JohnDoe')
      })

      it('should return only first name when last_name is missing', () => {
        const mockPayload = {
          user_id: 1,
          username: 'johndoe',
          first_name: 'John'
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const humanName = getHumanName()
        expect(humanName).toBe('John')
      })

      it('should return username when first_name is missing', () => {
        const mockPayload = {
          user_id: 1,
          username: 'johndoe',
          last_name: 'Doe'
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const humanName = getHumanName()
        expect(humanName).toBe('johndoe')
      })

      it('should return username when both names are empty strings', () => {
        const mockPayload = {
          user_id: 1,
          username: 'johndoe',
          first_name: '',
          last_name: ''
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const humanName = getHumanName()
        expect(humanName).toBe('johndoe')
      })

      it('should return null when no token exists', () => {
        const humanName = getHumanName()
        expect(humanName).toBeNull()
      })

      it('should return null when token is invalid', () => {
        localStorage.setItem('accessToken', 'invalid.token')

        const humanName = getHumanName()
        expect(humanName).toBeNull()
      })

      it('should handle first name with spaces', () => {
        const mockPayload = {
          user_id: 1,
          username: 'maryjane',
          first_name: 'Mary Jane',
          last_name: 'Watson'
        }
        const mockToken = createMockToken(mockPayload)
        localStorage.setItem('accessToken', mockToken)

        const humanName = getHumanName()
        expect(humanName).toBe('Mary JaneWatson')
      })
    })

    describe('getTheme', () => {
      it('should return null when no theme is stored', () => {
        expect(getTheme()).toBeNull()
      })

      it('should return dark when stored as dark', () => {
        localStorage.setItem('theme', 'dark')
        expect(getTheme()).toBe('dark')
      })

      it('should return light when stored as light', () => {
        localStorage.setItem('theme', 'light')
        expect(getTheme()).toBe('light')
      })
    })
  })

  describe('setters.ts', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    describe('setTheme', () => {
      it('should store dark theme in localStorage', () => {
        setTheme('dark')
        expect(localStorage.getItem('theme')).toBe('dark')
      })

      it('should store light theme in localStorage', () => {
        setTheme('light')
        expect(localStorage.getItem('theme')).toBe('light')
      })

      it('should overwrite existing theme', () => {
        setTheme('dark')
        setTheme('light')
        expect(localStorage.getItem('theme')).toBe('light')
      })
    })
  })

  describe("validator.ts", () => {
    it('should return true for valid email addresses', () => {
      expect(validator.isEmail('user@example.com')).toBe(true)
      expect(validator.isEmail('test.user@company.co')).toBe(true)
      expect(validator.isEmail('name+tag@domain.org')).toBe(true)
      expect(validator.isEmail('valid_email@test.mx')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validator.isEmail('invalid.email')).toBe(false)
      expect(validator.isEmail('@example.com')).toBe(false)
      expect(validator.isEmail('user@')).toBe(false)
      expect(validator.isEmail('user @example.com')).toBe(false)
      expect(validator.isEmail('')).toBe(false)
    })

    it('should return false for emails starting with numbers', () => {
      expect(validator.isEmail('123user@example.com')).toBe(false)
    })

    it('should return false for emails without proper domain', () => {
      expect(validator.isEmail('user@domain')).toBe(false)
      expect(validator.isEmail('user@.com')).toBe(false)
    })

    it('should return true for valid phone numbers', () => {
      expect(validator.isPhone('1234567')).toBe(true)
      expect(validator.isPhone('1234567890')).toBe(true)
      expect(validator.isPhone('123456789012345')).toBe(true)
    })

    it('should return false for invalid phone numbers', () => {
      expect(validator.isPhone('123456')).toBe(false)
      expect(validator.isPhone('1234567890123456')).toBe(false)
      expect(validator.isPhone('123-4567')).toBe(false)
      expect(validator.isPhone('abc1234567')).toBe(false)
      expect(validator.isPhone('')).toBe(false)
    })
  })

  describe("parser.ts", () => {
    it("should compose complete employees with nested job position and department", () => {
      const users: user[] = [
        {
          id: 1,
          last_login: "",
          is_superuser: false,
          username: "jdoe",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          is_staff: false,
          is_active: true,
          date_joined: "",
          groups: [],
          user_permissions: [],
        },
      ]

      const departments: department[] = [
        {
          id: 10,
          name: "RH",
          description: "Recursos Humanos",
          enabled: true,
        },
      ]

      const jobPositions: jobPosition[] = [
        {
          id: 100,
          name: "Analista",
          description: "Analista RH",
          enabled: true,
          department: 10,
        },
      ]

      const employees: employee[] = [
        {
          id: 1000,
          join_date: "2025-01-01",
          phone: "555-1234",
          enabled: true,
          user: 1,
          job_position: 100,
        },
      ]

      const result = parseEmployee([users, departments, jobPositions, employees])

      expect(result).toHaveLength(1)
      expect(result[0].user.first_name).toBe("John")
      expect(result[0].job_position.name).toBe("Analista")
      expect(result[0].job_position.department.name).toBe("RH")
    })

    it("should skip employees with missing references", () => {
      const users: user[] = []
      const departments: department[] = []
      const jobPositions: jobPosition[] = []
      const employees: employee[] = [
        {
          id: 1,
          join_date: "",
          phone: "",
          enabled: true,
          user: 999,
          job_position: 888,
        },
      ]

      const result = parseEmployee([users, departments, jobPositions, employees])

      expect(result).toEqual([])
    })
  })
})

// Helper function to create mock JWT tokens
function createMockToken(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = 'mock-signature'
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}
