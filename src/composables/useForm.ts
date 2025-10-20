import { ref, computed, type Ref } from 'vue'

export interface UserFormData {
    name: string
    email: string
    status: string
}

export interface UseUserFormReturn {
    formData: Ref<UserFormData>
    showErrors: Ref<boolean>
    nameError: Ref<string>
    emailError: Ref<string>
    statusError: Ref<string>
    isValid: Ref<boolean>
    resetForm: () => void
    setFormData: (data: UserFormData) => void
    setShowErrors: (show: boolean) => void
}

const NAME_REGEX = /^[\p{L}\p{N}\s\-\.+]{2,50}$/u
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useUserForm(initialData: UserFormData = { name: '', email: '', status: '' }): UseUserFormReturn {
    const formData = ref<UserFormData>({ ...initialData })
    const showErrors = ref(false)

    const nameError = computed(() => {
        const name = formData.value.name?.trim() ?? ''
        if (!name) return 'Name is required.'
        if (name.length < 2) return 'Name must be at least 2 characters.'
        if (name.length > 50) return 'Name must be at most 50 characters.'
        if (!NAME_REGEX.test(name)) return 'Invalid characters.'
        return ''
    })

    const emailError = computed(() => {
        const email = formData.value.email?.trim() ?? ''
        if (!email) return 'Email is required.'
        if (!EMAIL_REGEX.test(email)) return 'Invalid email address.'
        return ''
    })

    const statusError = computed(() => {
        const status = formData.value.status?.trim() ?? ''
        if (!status) return 'Status is required.'
        if (!['Active', 'Inactive'].includes(status)) return 'Status must be Active or Inactive.'
        return ''
    })

    const isValid = computed(() => !nameError.value && !emailError.value && !statusError.value)

    const resetForm = () => {
        formData.value = { name: '', email: '', status: '' }
        showErrors.value = false
    }

    const setFormData = (data: UserFormData) => {
        formData.value = { ...data }
    }

    const setShowErrors = (show: boolean) => {
        showErrors.value = show
    }

    return {
        formData,
        showErrors,
        nameError,
        emailError,
        statusError,
        isValid,
        resetForm,
        setFormData,
        setShowErrors
    }
}
