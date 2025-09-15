import type { AccountType } from './../types/account'

export function validateLabelsInput(input: string): string | null {
    if (!input) return null
    return input.length <= 50 ? null : 'Максимум 50 символов'
}

export function validateLogin(login: string): string | null {
    if (!login.trim()) return 'Обязательное поле'
    return login.length <= 100 ? null : 'Максимум 100 символов'
}

export function validatePassword(type: AccountType, password: string): string | null {
    if (type === 'LDAP') return null
    if (!password.trim()) return 'Обязательное поле'
    return password.length <= 100 ? null : 'Максимум 100 символов'
}