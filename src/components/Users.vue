<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="users-wrapper">
        <header class="users-header">
            <h1>Users</h1>
            <div v-if="success" class="success-banner">
                {{ success }}
            </div>
        </header>
        <SearchInput v-model="searchName" placeholder="Search by Name (e.g. Basic)" />
        <UserTable :items="filteredUsers" @edit="handleEdit" @delete="handleDelete" />

        <div class="actions">
            <v-btn variant="outlined" color="primary" @click="openCreateModal">
                Create
            </v-btn>
        </div>

        <UserModal v-model="createModalOpen" :saving="createSaving" @save="handleCreate" @cancel="closeCreateModal" />

        <UserModal v-model="editModalOpen" :user="editingUser" :saving="editSaving" @save="handleEditSave"
            @cancel="closeEditModal" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import SearchInput from './SearchInput.vue'
import UserTable from './UserTable.vue'
import UserModal from './UserModal.vue'
import { useNameSearch } from '../composables/useSearch'
import { useUserCrud } from '../composables/useUserCrud'

const {
    users,
    success,
    createUserItem,
    updateUserItem,
    deleteUserItem
} = useUserCrud()

const { searchTerm: searchName, filteredItems: filteredUsers } = useNameSearch(computed(() => users.value ?? []))

const createModalOpen = ref(false)
const editModalOpen = ref(false)
const editingUser = ref<User | null>(null)
const createSaving = ref(false)
const editSaving = ref(false)

const openCreateModal = () => {
    createModalOpen.value = true
}

const closeCreateModal = () => {
    createModalOpen.value = false
}

const openEditModal = (user: User) => {
    editingUser.value = user
    editModalOpen.value = true
}

const closeEditModal = () => {
    editModalOpen.value = false
    editingUser.value = null
}

const handleEdit = (user: User) => {
    openEditModal(user)
}

const handleDelete = async (user: User) => {
    await deleteUserItem(user)
}

const handleCreate = async (data: { name: string; email: string; status: string }) => {
    createSaving.value = true
    try {
        const result = await createUserItem(data)
        if (result) {
            closeCreateModal()
        }
    } finally {
        createSaving.value = false
    }
}

const handleEditSave = async (data: { name: string; email: string; status: string }) => {
    if (!editingUser.value) return

    editSaving.value = true
    try {
        const result = await updateUserItem(editingUser.value.id, data)
        if (result) {
            closeEditModal()
        }
    } finally {
        editSaving.value = false
    }
}
</script>

<style lang="scss" scoped>
.users-wrapper {
    max-width: 960px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .05);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
}

.success-banner {
    margin-top: 1.5rem;
    background: #e9f9ed;
    color: #2c7a34;
    border: 1px solid #b6e2c6;
    padding: .6rem .75rem;
    border-radius: 8px;
    font-weight: 500;
}

.users-header {
    text-align: center;

    h1 {
        margin: 0;
        font-size: 2rem;
        color: #2c3e50;
    }

    p {
        margin: .25rem 0;
        color: #555;
    }
}

.error-banner {
    margin-top: .5rem;
    background: #fdecea;
    color: #b13028;
    border: 1px solid #f5c2c0;
    padding: .6rem .75rem;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: .5rem;

    .retry {
        background: #b13028;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: .35rem .6rem;
        cursor: pointer;
    }
}

.actions {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>
