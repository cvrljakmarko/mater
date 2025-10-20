import { type AxiosResponse } from 'axios'
import client from '../api/client'
import type { User } from '../types/user'

export const fetchUsers = async (): Promise<User[] | null> => {
    try {
        const { data }: AxiosResponse<User[]> = await client.get('/users')
        return data
    } catch (error) {
        console.error('[fetchUsers] Error:', error)
        return null
    }
}

export const fetchUser = async (id: string): Promise<User | null> => {
    try {
        const { data }: AxiosResponse<User> = await client.get(`/users/${id}`)
        return data
    } catch (error) {
        console.error(`[fetchUser] Failed for id="${id}":`, error)
        return null
    }
}

export async function createUser(payload: Pick<User, 'name' | 'email' | 'status'>): Promise<User> {
    const { data }: AxiosResponse<User> = await client.post('/users', payload)
    return data
}

export async function updateUser(
    id: string,
    payload: Pick<User, 'name' | 'email' | 'status'>
): Promise<User> {
    const { data }: AxiosResponse<User> = await client.put(`/users/${id}`, payload)
    return data
}

export async function patchUser(
    id: string,
    payload: Partial<Pick<User, 'name' | 'email' | 'status'>>
): Promise<User> {
    const { data }: AxiosResponse<User> = await client.patch(`/users/${id}`, payload)
    return data
}

export async function deleteUser(id: string): Promise<void> {
    await client.delete(`/users/${id}`)
}
