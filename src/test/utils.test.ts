import { describe, it, expect } from "vitest"
import { getDataFromForm } from "../utils/getters"
import * as validator from "../utils/validator"

describe("Utils package", () => {
  describe("getters.ts", () => {
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
