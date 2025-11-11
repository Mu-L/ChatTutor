import type { Component } from '@dsl/renderer-core'

export type Template = {
  id: string
  content?: Component<string> | string
  templates?: Template[]
}

export default [
  
] as Template[]