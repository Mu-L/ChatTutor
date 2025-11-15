import { theme } from '@dsl/utils-theme'
import { tag } from '@dsl/utils-canvas'
import katex from 'katex'

export function tex(input: string, color: string = 'primary') {
  const container = tag('g')
  const object = tag('foreignObject')
  object.attr('xmlns', 'http://www.w3.org/1999/xhtml')
  const div = tag('div')
  div.attr('style', `color: ${theme.pallete(color)}`)
  div.attr('innerHTML', katex.renderToString(input, {
    output: 'mathml',
  }))
  return container.append(object.node(), div.node()).node()
}