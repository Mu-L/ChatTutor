export type Action<T extends object = Record<string, unknown>, A extends string = string> = {
  type: A
  options: T
}

export interface FullAction<T extends object = Record<string, unknown>, A extends string = string> extends Action<T, A> {
  page?: string
}

export type FullizeAction<T extends Action = Action> = FullAction<T['options'], T['type']>
