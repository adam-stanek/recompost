import * as React from 'react'
import { assert } from 'chai'

import { createComposer } from 'recompost'
import { render } from 'test/utils/render'

interface NameProps {
  name: string
}

interface NameWithSalutationProps extends NameProps {
  salutation: string
}

interface ClassNameProps {
  className?: string
}

describe('ComponentDecoratorBuilder::withDecorator()', () => {
  it('applies custom decorator', async () => {
    const withSalutation: (
      salutation: string,
    ) => (
      enhancedComponent:
        | React.SFC<NameWithSalutationProps>
        | React.ComponentClass<NameWithSalutationProps>,
    ) => React.SFC<NameProps> = salutation => enhancedComponent => ({
      name,
      children,
      ...props
    }) =>
      React.createElement(
        enhancedComponent,
        {
          ...props,
          name,
          salutation: `${salutation} ${name}!`,
        },
        children,
      )

    const decorate = createComposer<NameProps>()
      .withDecorator(withSalutation('Hi'))
      .build()

    const Foo = decorate(({ salutation }) => <div>{salutation}</div>)
    const container = await render(<Foo name="Bob" />)
    assert.strictEqual(container.innerHTML, '<div>Hi Bob!</div>')
  })

  it('allows chain with result of another decorator builder', async () => {
    const withDefaultClassName = createComposer<ClassNameProps>()
      .withDefaultProps({ className: 'someClass' })
      .build()

    const decorate = createComposer<ClassNameProps & NameProps>()
      .withDecorator(withDefaultClassName)
      .build()

    const Foo = decorate(({ className, name }) => (
      <div className={className}>{name}</div>
    ))
    const container = await render(<Foo name="Alice" />)
    assert.strictEqual(
      container.innerHTML,
      '<div class="someClass">Alice</div>',
    )
  })
})
