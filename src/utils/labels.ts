import type { Label } from './../types/account'

export function parseLabelsInput(input: string): Label[] {
    return input
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((text) => ({ text }))
}

export function labelsToInput(labels: Label[]): string {
    return labels.map((l) => l.text).join('; ')
}