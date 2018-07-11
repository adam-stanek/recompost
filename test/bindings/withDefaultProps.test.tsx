import * as React from 'react'
import { assert } from 'chai'

import { createComposer } from 'recompost'
import { render } from 'test/utils/render'

interface TestProps {
  className?: string | (() => string)
  someOtherOptionalProp?: number
}

describe('ComponentDecoratorBuilder::withDefaultProps()', () => {
  it('it fills default props', async () => {
    const decorate = createComposer<TestProps>()
      .withDefaultProps({ className: 'blue' })
      .build()

    const Foo = decorate(({ className, someOtherOptionalProp }) => (
      <div className={typeof className === 'string' ? className : className()}>
        {someOtherOptionalProp || ''}
      </div>
    ))

    const container = await render(<Foo />)
    const renderedClassName = container.firstElementChild && container.firstElementChild.className
    assert.strictEqual(renderedClassName, 'blue')
  })

  it('it allows overriding of the provided default value', async () => {
    const decorate = createComposer<TestProps>()
      .withDefaultProps({ className: 'blue' })
      .build()

    const Foo = decorate(({ className, someOtherOptionalProp }) => (
      <div className={typeof className === 'string' ? className : className()}>
        {someOtherOptionalProp || ''}
      </div>
    ))

    const container = await render(<Foo className="red" />)
    const renderedDiv = container.firstElementChild as HTMLDivElement
    assert.strictEqual(renderedDiv.attributes.getNamedItem('class')!.value, 'red')
  })

  it('merges default props with any existing props', async () => {
    interface SomeComponentProps {
      className?: string
      'aria-hidden'?: boolean
      role: string | undefined
    }

    const SomeComponent: React.SFC<SomeComponentProps> = props => <div {...props} />

    SomeComponent.defaultProps = {
      className: 'red',
      'aria-hidden': false,
    }

    const decorate = createComposer<{
      className?: string
    }>()
      .withDefaultProps({ className: 'blue', role: 'article' })
      .build()

    const DecoratedComponent = decorate(SomeComponent)

    const container = await render(<DecoratedComponent />)
    const renderedDiv = container.firstElementChild as HTMLDivElement
    assert.strictEqual(renderedDiv.attributes.getNamedItem('class')!.value, 'blue')
    assert.strictEqual(renderedDiv.attributes.getNamedItem('role')!.value, 'article')
    assert.strictEqual(renderedDiv.attributes.getNamedItem('aria-hidden')!.value, 'false')
  })
})
