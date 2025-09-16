import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Account } from './../types/account'

const STORAGE_KEY = 'accounts_store_v1'

function load(): Account[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as Account[]) : []
    } catch {
        return []
    }
}

export const useAccountsStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>(load())

    function add(a: Account) {
        accounts.value.push(a)
    }

    function upsert(a: Account) {
        const i = accounts.value.findIndex(x => x.id === a.id)
        if (i >= 0) accounts.value[i] = a
        else accounts.value.push(a)
    }

    function remove(id: string) {
        accounts.value = accounts.value.filter(x => x.id !== id)
    }

    watch(
        accounts,
        val => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
        },
        { deep: true }
    )

    return { accounts, add, upsert, remove }
})