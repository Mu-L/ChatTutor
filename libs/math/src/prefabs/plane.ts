import { tag } from '@dsl/utils-canvas'
import { definePrefab, ref, registerPrefab } from '@dsl/renderer-core'
import type { Vector2 } from '../utils'
import { theme } from '@dsl/utils-theme'

export interface PlaneAttributes {
  range: Vector2
  domain: Vector2
  axis: boolean
  grid: boolean
}

export const plane = definePrefab<'plane', PlaneAttributes>(() => {
  const aspectWidth = ref(1)
  const aspectHeight = ref(-1)
  return {
    name: 'plane',
    generator(attrs, children, { mount }) {
      const { range, domain } = attrs
      const container = document.createElement('div')
      const canvas = tag('svg')
      const width = range[1] - range[0]
      const height = domain[1] - domain[0]
      const aspectRatio = width / height
      canvas.attr('width', '100%')
      canvas.attr('height', '100%')
      container.style.width = '100%'
      container.style.aspectRatio = `${aspectRatio}`

      const root = tag('g')
      canvas.append(root.node())

      const xAxis = tag('line')
      const yAxis = tag('line')
      const xTicks = tag('g')
      const yTicks = tag('g')
      const grid = tag('g')
      if (attrs.axis) {
        xAxis.attr('stroke', theme.pallete('primary'))
        xAxis.attr('stroke-width', '2')
        yAxis.attr('stroke', theme.pallete('primary'))
        yAxis.attr('stroke-width', '2')

        // ticks
        xTicks.attr('stroke', theme.pallete('primary'))
        xTicks.attr('stroke-width', '2')
        yTicks.attr('stroke', theme.pallete('primary'))
        yTicks.attr('stroke-width', '2')
        for (let i = -9; i <= 10; i += 1) {
          const tickX = tag('line')
          tickX.attr('x1', `${i * 10}%`)
          tickX.attr('y1', '-10')
          tickX.attr('x2', `${i * 10}%`)
          tickX.attr('y2', '10')
          xTicks.append(tickX.node())
          const tickY = tag('line')
          tickY.attr('x1', '-10')
          tickY.attr('y1', `${i * 10}%`)
          tickY.attr('x2', '10')
          tickY.attr('y2', `${i * 10}%`)
          yTicks.append(tickY.node())
        }

        root.append(xTicks.node())
        root.append(yTicks.node())
        root.append(xAxis.node())
        root.append(yAxis.node())
      }
      if (attrs.grid) {
        grid.attr('stroke', theme.pallete('primary'))
        grid.attr('stroke-width', '1')
        for (let i = -10; i <= 10; i += 1) {
          const gridX = tag('line')
          gridX.attr('x1', `${i * 10}%`)
          gridX.attr('y1', '-100%')
          gridX.attr('x2', `${i * 10}%`)
          gridX.attr('y2', '100%')
          grid.append(gridX.node())
          const gridY = tag('line')
          gridY.attr('x1', '-100%')
          gridY.attr('y1', `${i * 10}%`)
          gridY.attr('x2', '100%')
          gridY.attr('y2', `${i * 10}%`)
          grid.append(gridY.node())
        }
        root.append(grid.node())
      }

      mount(() => {
        const { width: w, height: h } = canvas.node().getBoundingClientRect()
        root.attr('transform', `translate(${w * ((0 - domain[0]) / width)}, ${h * ((0 - range[0]) / height)})`)

        aspectWidth.value = w / width
        aspectHeight.value = -h / height

        xAxis.attr('x1', `${aspectWidth.value * domain[0]}`)
        xAxis.attr('x2', `${aspectWidth.value * domain[1]}`)
        xAxis.attr('y1', '0')
        xAxis.attr('y2', '0')
        yAxis.attr('x1', '0')
        yAxis.attr('x2', '0')
        yAxis.attr('y1', `${aspectHeight.value * range[0]}`)
        yAxis.attr('y2', `${aspectHeight.value * range[1]}`)
      })

      container.appendChild(canvas.node())

      root.node().append(...children())
      
      return container
    },
    defaults: {
      axis: true,
      grid: true,
    },
    provides: {
      aspectWidth,
      aspectHeight,
    }
  }
})

export type PlaneProvides = {
  aspectWidth: number
  aspectHeight: number
}

registerPrefab('plane', plane)
