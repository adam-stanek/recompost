import * as React from 'react'
import { assert } from 'chai'

import { createComposer } from 'recompost'
import { render } from 'test/utils/render'

describe('ComponentDecoratorBuilder::withState()', () => {
  it('it appends state', async () => {
    const decorate = createComposer()
      .withState('salutation', 'setSalute', 'Hello Bob!')
      .build()

    const Salutation = decorate(({ salutation }) => <div>{salutation}</div>)

    const container = await render(<Salutation />)
    assert.strictEqual(container.innerHTML, '<div>Hello Bob!</div>')
  })

  it('it appends state setter', async () => {
    const decorate = createComposer()
      .withState('salutation', 'setSalute', '')
      .build()

    const Salutation = decorate(({ salutation, setSalute }) => {
      if (salutation === '') setSalute('Ahoj Bobe!')
      return <div>{salutation}</div>
    })

    const container = await render(<Salutation />)
    assert.strictEqual(container.innerHTML, '<div>Ahoj Bobe!</div>')
  })

  // FIXME: come up with a better way how to test this
  it('it appends derived state', async () => {
    const decorate = createComposer()
      .withState('name', 'setName', 'Bob')
      .withState('salutation', 'setSalute', 'Hi' as string, ({ name }) => {
        switch (name) {
          case 'Bob':
            return 'Hi'
          case 'Captain':
            return 'Ahoy'
          default:
            return null
        }
      })
      .build()

    const Salutation = decorate(({ name, salutation, setName }) => {
      if (name === 'Bob') setName('Captain')
      return <div>{`${salutation} ${name}`}</div>
    })

    const container = await render(<Salutation />)
    assert.strictEqual(container.innerHTML, '<div>Ahoy Captain</div>')
  })
})
