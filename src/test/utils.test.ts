import { describe, it, expect, beforeEach } from "vitest"
import { getDataFromForm, getHumanName, getTheme } from "../utils/getters"
import { setTheme } from "../utils/setters"
import * as validator from "../utils/validator"

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
  })
})

// Helper function to create mock JWT tokens
function createMockToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = 'mock-signature'
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}
