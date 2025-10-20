<template>
    <v-data-table :headers="headers" :items="items" item-value="id" return-object select-strategy="all"
        :items-per-page="5" class="users-table">
        <template #item.actions="{ item }">
            <v-btn size="small" variant="text" @click="handleEdit(item)">Edit</v-btn>
            <v-btn size="small" variant="text" color="error" @click="handleDelete(item)">Delete</v-btn>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '../types/user'

interface Props {
    items: User[]
}

interface Emits {
    (e: 'update:selectedIds', value: string[]): void
    (e: 'edit', user: User): void
    (e: 'delete', user: User): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const headers = [
    { title: 'Name', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false }
]

const handleEdit = (user: User) => {
    emit('edit', user)
}

const handleDelete = (user: User) => {
    emit('delete', user)
}
</script>

<style lang="scss" scoped>
.users-table {
    width: 100%;

    :deep(.v-selection-control__input input) {
        opacity: unset;
    }

    :deep(thead th) {
        background: #f7f8fa;
        color: #2c3e50;
        font-weight: 700;
        border-bottom: 1px solid #e6e6e6;
    }

    :deep(tbody td) {
        border-bottom: 1px solid #efefef;
        color: #333;
        font-size: .95rem;
    }

    :deep(tbody tr:nth-child(even)) {
        background: #fbfbfb;
    }

    :deep(.v-table) {
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        overflow: hidden;
    }
}
</style>
