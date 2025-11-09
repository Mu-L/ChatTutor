import type { Page, PageType } from '@chat-tutor/shared'
import type { ElementAction } from './element'

export type CanvasPageAction = ElementAction

export type CanvasPageExtends = {
  range: [number, number] // y axis range
  domain: [number, number] // x axis range
  axis: boolean
  grid: boolean
}

export type CanvasPage = Page<CanvasPageAction, PageType.CANVAS> & CanvasPageExtends
