import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { request, api } from '../services/api'
import { userService, authService } from '../services/nexotic'

describe('Services package', () => {
  describe('api.ts', () => {
    let mockFetch: ReturnType<typeof vi.fn>

    beforeEach(() => {
      mockFetch = vi.fn()
      vi.stubGlobal('fetch', mockFetch)
      localStorage.clear()
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('request function', () => {
      it('should make successful GET request', async () => {
        const mockData = { id: 1, name: 'Test' }
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockData)
        })

        const result = await request('http://test.com/api')

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        expect(result).toEqual(mockData)
      })

      it('should include Authorization header when token exists', async () => {
        localStorage.setItem('accessToken', 'test-token')
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({})
        })

        await request('http://test.com/api')

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          }
        })
      })

      it('should merge custom headers with common headers', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({})
        })

        await request('http://test.com/api', {
          headers: { 'X-Custom-Header': 'value' }
        })

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'value'
          }
        })
      })

      it('should handle server error response', async () => {
        const errorData = { message: 'Server error' }
        mockFetch.mockResolvedValue({
          ok: false,
          status: 500,
          json: () => Promise.resolve(errorData)
        })

        const result = await request('http://test.com/api')

        expect(result).toEqual({
          error: true,
          status: 500,
          message: 'Server error',
          originalError: errorData
        })
      })

      it('should handle server error without message', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 404,
          json: () => Promise.resolve({})
        })

        const result = await request('http://test.com/api')

        expect(result).toEqual({
          error: true,
          status: 404,
          message: 'Error en la petición',
          originalError: {}
        })
      })

      it('should handle network error', async () => {
        mockFetch.mockRejectedValue(new Error('Network failed'))

        const result = await request('http://test.com/api')

        expect(result).toEqual({
          error: true,
          message: 'Network failed',
          object: expect.any(Error)
        })
      })

      it('should handle response with invalid JSON', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON'))
        })

        const result = await request('http://test.com/api')

        expect(result).toEqual({})
      })

      it('should pass request options correctly', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({})
        })

        await request('http://test.com/api', {
          method: 'POST',
          body: JSON.stringify({ data: 'test' })
        })

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          method: 'POST',
          body: JSON.stringify({ data: 'test' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      })
    })

    describe('api object methods', () => {
      beforeEach(() => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      })

      it('should make GET request', async () => {
        await api.get('http://test.com/api')

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          method: 'GET',
          headers: expect.any(Object)
        })
      })

      it('should make POST request with body', async () => {
        const body = { name: 'Test' }
        await api.post('http://test.com/api', body)

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: expect.any(Object)
        })
      })

      it('should make PUT request with body', async () => {
        const body = { id: 1, name: 'Updated' }
        await api.put('http://test.com/api', body)

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: expect.any(Object)
        })
      })

      it('should make PATCH request with body', async () => {
        const body = { name: 'Patched' }
        await api.patch('http://test.com/api', body)

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          method: 'PATCH',
          body: JSON.stringify(body),
          headers: expect.any(Object)
        })
      })

      it('should make DELETE request', async () => {
        await api.delete('http://test.com/api')

        expect(mockFetch).toHaveBeenCalledWith('http://test.com/api', {
          method: 'DELETE',
          headers: expect.any(Object)
        })
      })
    })
  })

  describe('nexotic.ts', () => {
    let mockFetch: ReturnType<typeof vi.fn>
    const API_URL = 'http://localhost:8000/'

    beforeEach(() => {
      mockFetch = vi.fn()
      vi.stubGlobal('fetch', mockFetch)
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('userService', () => {
      it('should have correct endpoint', () => {
        expect(userService.endpoint).toBe(API_URL + 'users/')
      })

      it('should get all users when id is 0', async () => {
        await userService.get(0)

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'users/',
          expect.objectContaining({ method: 'GET' })
        )
      })

      it('should get all users when no id provided', async () => {
        await userService.get()

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'users/',
          expect.objectContaining({ method: 'GET' })
        )
      })

      it('should get specific user by id', async () => {
        await userService.get(5)

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'users/5/',
          expect.objectContaining({ method: 'GET' })
        )
      })

      it('should not append id for negative numbers', async () => {
        await userService.get(-1)

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'users/',
          expect.objectContaining({ method: 'GET' })
        )
      })

      it('should not append id for non-integer numbers', async () => {
        await userService.get(1.5)

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'users/',
          expect.objectContaining({ method: 'GET' })
        )
      })

      it('should create user with username and password', async () => {
        const userData = { username: 'testuser', password: 'testpass' }
        await userService.create(userData)

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'users/',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(userData)
          })
        )
      })
    })

    describe('authService', () => {
      it('should have correct endpoint', () => {
        expect(authService.endpoint).toBe(API_URL + 'auth/')
      })

      it('should login with username and password', async () => {
        await authService.login('user', 'pass')

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'auth/login/',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              username: 'user',
              password: 'pass'
            })
          })
        )
      })

      it('should return null for refresh', () => {
        const result = authService.refresh()
        expect(result).toBeNull()
      })

      it('should signup with username and email', async () => {
        await authService.signup('newuser', 'user@example.com')

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'auth/signup/',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              username: 'newuser',
              email: 'user@example.com'
            })
          })
        )
      })

      it('should recover account with username and email', async () => {
        await authService.recover('user', 'user@example.com')

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'auth/recover/',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              username: 'user',
              email: 'user@example.com'
            })
          })
        )
      })

      it('should logout with refresh token', async () => {
        await authService.logout('refresh-token-123')

        expect(mockFetch).toHaveBeenCalledWith(
          API_URL + 'auth/logout/',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              refresh: 'refresh-token-123'
            })
          })
        )
      })
    })
  })
})
