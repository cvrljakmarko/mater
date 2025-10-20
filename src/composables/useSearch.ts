import { ref, computed, type Ref } from 'vue'

export interface SearchOptions<T> {
    searchFields?: (keyof T)[]
    caseSensitive?: boolean
    exactMatch?: boolean
    customFilter?: (item: T, searchTerm: string) => boolean
}

export interface UseSearchReturn<T> {
    searchTerm: Ref<string>
    filteredItems: Ref<T[]>
    clearSearch: () => void
    setSearchTerm: (term: string) => void
}

export function useSearch<T extends Record<string, any>>(
    items: Ref<T[]>,
    options: SearchOptions<T> = {}
): UseSearchReturn<T> {
    const {
        searchFields = [],
        caseSensitive = false,
        exactMatch = false,
        customFilter
    } = options

    const searchTerm = ref('')

    const filteredItems = computed(() => {
        const allItems = items.value ?? []
        const query = searchTerm.value.trim()

        if (!query) {
            return allItems
        }

        const normalizedQuery = caseSensitive ? query : query.toLowerCase()

        return allItems.filter(item => {
            if (customFilter) {
                return customFilter(item, query)
            }

            // If no search fields specified, search all string properties
            const fieldsToSearch = searchFields.length > 0
                ? searchFields
                : Object.keys(item).filter(key => typeof item[key] === 'string')

            return fieldsToSearch.some(field => {
                const fieldValue = item[field]
                if (typeof fieldValue !== 'string') return false

                const normalizedFieldValue = caseSensitive ? fieldValue : fieldValue.toLowerCase()

                return exactMatch
                    ? normalizedFieldValue === normalizedQuery
                    : normalizedFieldValue.includes(normalizedQuery)
            })
        })
    })

    const clearSearch = () => {
        searchTerm.value = ''
    }

    const setSearchTerm = (term: string) => {
        searchTerm.value = term
    }

    return {
        searchTerm,
        filteredItems,
        clearSearch,
        setSearchTerm
    }
}

export function useNameSearch<T extends Record<string, any>>(
    items: Ref<T[]>,
    nameField: keyof T = 'name' as keyof T
): UseSearchReturn<T> {
    return useSearch(items, {
        searchFields: [nameField],
        caseSensitive: false,
        exactMatch: false
    })
}
