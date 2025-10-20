<template>
    <v-dialog v-model="isOpen" max-width="420" @update:model-value="handleDialogChange">
        <v-card>
            <v-card-title>{{ isEdit ? `Edit User (${user?.id})` : 'Create User' }}</v-card-title>
            <v-card-text>
                <v-text-field v-model.trim="formData.name" label="Name" variant="outlined"
                    :error="showErrors && !!nameError" />
                <p v-if="showErrors && nameError" class="field-error">
                    {{ nameError }}
                </p>

                <v-text-field v-model.trim="formData.email" label="Email" type="email" variant="outlined"
                    :error="showErrors && !!emailError" />
                <p v-if="showErrors && emailError" class="field-error">
                    {{ emailError }}
                </p>

                <v-select v-model="formData.status" :items="['Active', 'Inactive']" label="Status" variant="outlined"
                    :error="showErrors && !!statusError" />
                <p v-if="showErrors && statusError" class="field-error">
                    {{ statusError }}
                </p>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn :disabled="saving" text @click="handleCancel">Cancel</v-btn>
                <v-btn color="primary" :loading="saving" @click="handleSave">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useUserForm, type UserFormData } from '../composables/useForm'
import type { User } from '../types/user'

interface Props {
    modelValue: boolean
    user?: User | null
    saving?: boolean
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', data: { name: string; email: string; status: string }): void
    (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
    user: null,
    saving: false
})

const emit = defineEmits<Emits>()

const isEdit = computed(() => !!props.user)

const initialData: UserFormData = props.user
    ? { name: props.user.name, email: props.user.email, status: props.user.status }
    : { name: '', email: '', status: '' }

const {
    formData,
    showErrors,
    nameError,
    emailError,
    statusError,
    isValid,
    resetForm,
    setFormData,
    setShowErrors
} = useUserForm(initialData)

const isOpen = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
})

watch(
    () => props.user,
    (newUser) => {
        if (newUser) {
            setFormData({ name: newUser.name, email: newUser.email, status: newUser.status })
        } else {
            resetForm()
        }
    },
    { immediate: true }
)

const handleDialogChange = (value: boolean) => {
    if (!value) {
        handleCancel()
    }
}

const handleCancel = () => {
    resetForm()
    setShowErrors(false)
    emit('cancel')
    emit('update:modelValue', false)
}

const handleSave = () => {
    setShowErrors(true)
    if (!isValid.value) return

    const data = {
        name: formData.value.name.trim(),
        email: formData.value.email.trim(),
        status: formData.value.status.trim()
    }

    emit('save', data)
}
</script>

<style lang="scss" scoped>
.field-error {
    margin: .25rem 0 0;
    color: #b13028;
    font-size: .85rem;
}
</style>
