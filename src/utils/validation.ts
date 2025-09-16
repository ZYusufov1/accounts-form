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

    const p = password ?? ''

    if (!p.trim()) return 'Обязательное поле'
    if (p.length > 100) return 'Максимум 100 символов'
    if (p.length < 8) return 'Минимум 8 символов'

    const hasDigit = /\d/.test(p)
    const hasSpecial = /[^A-Za-z0-9]/.test(p)

    if (!hasDigit || !hasSpecial) return 'Пароль должен содержать цифры и спецсимволы'

    return null
}