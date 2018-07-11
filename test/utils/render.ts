import * as React from 'react'
import * as ReactDOM from 'react-dom'

/**
 * Renders given react element into freshly created DOM container and returns
 */
export function render(
  el: React.ReactElement<any> | React.ReactElement<any>,
): Promise<HTMLDivElement> {
  return new Promise(resolve => {
    const rootEl = document.createElement('div')
    document.body.appendChild(rootEl)
    ReactDOM.render(el, rootEl, () => {
      resolve(rootEl)
    })
  })
}
