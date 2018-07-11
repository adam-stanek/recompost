import * as React from 'react'
import { assert } from 'chai'

import { createComposer } from 'recompost'
import { render } from 'test/utils/render'

interface NameProps {
  name: string
}

interface ClassNameProps {
  className?: string
}

describe('ComponentDecoratorBuilder::append()', () => {
  it('appends decorators from another builder', async () => {
    const builder1 = createComposer<ClassNameProps>().withProps({
      className: 'salutation',
    })

    const decorate = createComposer<ClassNameProps & NameProps>()
      .append(builder1)
      .withProps(({ name }) => ({ salutation: `Hello, ${name}!` }))
      .build()

    const Foo = decorate(({ className, salutation }) => (
      <div className={className}>{salutation}</div>
    ))

    const container = await render(<Foo name="Bob" />)
    assert.strictEqual(
      container.innerHTML,
      '<div class="salutation">Hello, Bob!</div>',
    )
  })
})

it('it works with class components', async () => {
  class SomeComponent extends React.Component<{
    className?: string
    'aria-hidden'?: boolean
    role: string
  }> {
    public static defaultProps = {
      className: 'red',
      'aria-hidden': false,
    }

    public render() {
      return <div {...this.props} />
    }
  }

  const decorate = createComposer<{
    className?: string
  }>()
    .withDefaultProps({ className: 'blue', role: 'article' })
    .build()

  const DecoratedComponent = decorate(SomeComponent)

  const container = await render(<DecoratedComponent />)
  const renderedDiv = container.firstElementChild as HTMLDivElement
  assert.strictEqual(
    renderedDiv.attributes.getNamedItem('class')!.value,
    'blue',
  )
  assert.strictEqual(
    renderedDiv.attributes.getNamedItem('role')!.value,
    'article',
  )
  assert.strictEqual(
    renderedDiv.attributes.getNamedItem('aria-hidden')!.value,
    'false',
  )
})
