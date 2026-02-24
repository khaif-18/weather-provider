// types/app.types.ts

export interface AppError {
  code: string
  message: string
  status?: number
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'frost'
export type Align = 'left' | 'center' | 'right'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  icon?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
