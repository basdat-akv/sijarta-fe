import { cookies } from 'next/headers'

export const setAuthCookie = async (token: string) => {
  (await cookies()).set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
}

export const removeAuthCookie = async () => {
  (await cookies()).delete('auth-token')
}

export const getAuthCookie = async () => {
  return (await cookies()).get('auth-token')
}