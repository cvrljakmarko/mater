// composables/useUserCrud.ts
import { ref, onMounted, type Ref } from 'vue'
import { fetchUsers, createUser, updateUser, deleteUser } from '../actions/fetch'
import type { User } from '../types/user'

export interface UseUserCrudReturn {
    users: Ref<User[] | null>
    loading: Ref<boolean>
    error: Ref<string | null>
    success: Ref<string | null>
    selectedIds: Ref<string[]>
    reload: () => Promise<void>
    createUserItem: (data: { name: string; email: string; status: string }) => Promise<User | null>
    updateUserItem: (id: string, data: { name: string; email: string; status: string }) => Promise<User | null>
    deleteUserItem: (user: User) => Promise<boolean>
    clearMessages: () => void
}

export function useUserCrud(): UseUserCrudReturn {
    const users = ref<User[] | null>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const success = ref<string | null>(null)
    const selectedIds = ref<string[]>([])

    const setSuccess = (msg: string, ms = 3000) => {
        success.value = msg
        error.value = null
        window.setTimeout(() => (success.value = null), ms)
    }

    const reload = async () => {
        loading.value = true
        try {
            error.value = null
            const data = await fetchUsers()
            users.value = data ?? []
        } catch (err: any) {
            error.value = err?.message ?? 'Something went wrong. Please try again.'
            users.value = []
        } finally {
            loading.value = false
        }
    }

    const createUserItem = async (
        data: { name: string; email: string; status: string }
    ): Promise<User | null> => {
        try {
            const created = await createUser(data)
            users.value = [...(users.value ?? []), created]
            setSuccess(`User "${created.name}" created successfully!`, 5000)
            return created
        } catch (e: any) {
            error.value = e?.message ?? 'Something went wrong. Please try again.'
            return null
        }
    }

    const updateUserItem = async (
        id: string,
        data: { name: string; email: string; status: string }
    ): Promise<User | null> => {
        try {
            const updated = await updateUser(id, data)
            users.value = (users.value ?? []).map(u =>
                String(u.id) === String(updated.id) ? updated : u
            )
            setSuccess(`User "${updated.name}" updated successfully!`)
            return updated
        } catch (e: any) {
            error.value = e?.message ?? 'Something went wrong. Please try again.'
            return null
        }
    }

    const deleteUserItem = async (user: User): Promise<boolean> => {
        const id = String(user.id)
        const ok = window.confirm(`Delete user "${user.name}" (ID ${id})?`)
        if (!ok) return false

        try {
            await deleteUser(id)
            users.value = (users.value ?? []).filter(u => String(u.id) !== id)
            setSuccess(`User "${user.name}" deleted.`)
            return true
        } catch (e: any) {
            error.value = e?.message ?? 'Failed to delete. Please try again.'
            return false
        }
    }

    const clearMessages = () => {
        error.value = null
        success.value = null
    }

    onMounted(reload)

    return {
        users,
        loading,
        error,
        success,
        selectedIds,
        reload,
        createUserItem,
        updateUserItem,
        deleteUserItem,
        clearMessages
    }
}
