import * as React from 'react'
import { assert } from 'chai'

import { createComposer } from 'recompost'
import { render } from 'test/utils/render'

interface NameProps {
  name: string
}

describe('ComponentDecoratorBuilder::withHandler()', () => {
  it('it adds the handler prop', async () => {
    const decorate = createComposer<NameProps>()
      .withHandler('composeSalutation', ({ name }) => (salutation: string) =>
        `${salutation} ${name}!`,
      )
      .build()

    const Foo = decorate(({ composeSalutation }) => (
      <div>{composeSalutation('Hi')}</div>
    ))

    const container = await render(<Foo name="Bob" />)
    assert.strictEqual(container.innerHTML, '<div>Hi Bob!</div>')
  })
})
