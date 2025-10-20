<template>
    <div class="search-input-wrapper">
        <input type="text" :value="modelValue" @input="handleInput" :placeholder="placeholder" :disabled="disabled"
            class="search-input" :class="{ 'search-input--disabled': disabled }" />
        <button v-if="showClearButton && modelValue" @click="clearSearch" class="search-clear-button" type="button"
            aria-label="Clear search">
            ×
        </button>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'

interface Props {
    modelValue: string
    placeholder?: string
    disabled?: boolean
    showClearButton?: boolean
    debounceMs?: number
}

interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'search', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Search...',
    disabled: false,
    showClearButton: true,
    debounceMs: 300
})

const emit = defineEmits<Emits>()

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const scheduleSearch = (value: string) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    // If debounce is 0 or negative, emit immediately
    if (!props.debounceMs || props.debounceMs <= 0) {
        emit('search', value)
        return
    }

    debounceTimer = setTimeout(() => {
        emit('search', value)
        debounceTimer = null
    }, props.debounceMs)
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = target.value
    emit('update:modelValue', value)
    scheduleSearch(value)
}

const clearSearch = () => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
    }
    emit('update:modelValue', '')
    emit('search', '')
}

onBeforeUnmount(() => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
    }
})
</script>

<style lang="scss" scoped>
.search-input-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    position: relative;
}

.search-input {
    flex: 1;
    max-width: 420px;
    padding: .6rem .8rem;
    padding-right: 2.5rem;
    border: 1px solid #dcdcdc;
    border-radius: 6px;
    font-size: .95rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    background: #fff;

    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, .12);
    }

    &::placeholder {
        color: #999;
    }

    &--disabled {
        background: #f5f5f5;
        color: #999;
        cursor: not-allowed;
    }
}

.search-clear-button {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #999;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
        color: #666;
        background-color: #f0f0f0;
    }

    &:focus {
        outline: 2px solid #3498db;
        outline-offset: 2px;
    }
}
</style>
