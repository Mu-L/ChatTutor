import { tag } from '@dsl/utils-canvas'
import { definePrefab, registerPrefab } from '@dsl/renderer-core'
import type { Vector2 } from '../utils'
import { theme } from '@dsl/utils-theme'

export const MAX_RANGE = 500
export const STEP = 100

export interface PlaneAttributes {
  range: Vector2
  domain: Vector2
}

export const plane = definePrefab<'plane', PlaneAttributes>(() => {
  return {
    name: 'plane',
    generator(attrs, children, { mount }) {
      const { range, domain } = attrs
      const standard = Math.max(
        Math.abs(range[0] - range[1]),
        Math.abs(domain[0] - domain[1]),
      )
      const division = MAX_RANGE / standard

      const xAxis = tag('line')
        .attr('x1', `${range[0]}`)
        .attr('y1', '0')
        .attr('x2', `${range[1]}`)
        .attr('y2', '0')
        .attr('stroke', theme.pallete('primary'))
        .attr('stroke-width', '2')
        .node()
      
      const yAxis = tag('line')
        .attr('x1', '0')
        .attr('y1', `${domain[0]}`)
        .attr('x2', '0')
        .attr('y2', `${domain[1]}`)
        .attr('stroke', theme.pallete('primary'))
        .attr('stroke-width', '2')
        .node()
      
      const xTicks = tag('g')
        .attr('stroke', theme.pallete('primary'))
        .attr('stroke-width', '2')
        .node()
      for (let i = range[0]; i <= range[1]; i += Math.abs(range[0] - range[1]) / STEP) {
        const tick = tag('line')
          .attr('x1', `${i}`)
          .attr('y1', '0')
          .attr('x2', `${i}`)
          .attr('y2', '0')
          .attr('stroke', theme.pallete('primary'))
          .attr('stroke-width', '2')
          .node()
        xTicks.append(tick)
      }

      const root = tag('g')
        .attr('transform', `scale(${division})`)
        .append(xAxis)
        .append(yAxis)
        .append(xTicks)
        .node()
      
      mount(() => {
        const { width, height } = root.getBoundingClientRect()
        root.setAttribute('transform', `translate(${width / 2}, ${height / 2}), scale(${division})`)
      })
      
      return root
    },
  }
})

registerPrefab('plane', plane)
