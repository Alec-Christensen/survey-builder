import api from './api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

const TOKEN_KEY = 'token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data)
  localStorage.setItem(TOKEN_KEY, response.data.token)
  return response.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data)
  localStorage.setItem(TOKEN_KEY, response.data.token)
  return response.data
}
