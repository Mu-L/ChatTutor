import type { PageType, Action, FullizeAction, Page  } from '@chat-tutor/shared'
import type { BlockResolver } from './blockParser'

export type RunGGBScriptAction = Action<{ content: string }, 'run-ggbscript'>

export type GGBPage = Page<RunGGBScriptAction, PageType.GGB>

export const ggbBlockResolver: BlockResolver = ({ page, content }, emit) => {
  const action: FullizeAction<RunGGBScriptAction> = {
    type: 'run-ggbscript',
    options: { content },
    page: page.id,
  }
  page.steps.push(action)
  emit(action)
  return action
}