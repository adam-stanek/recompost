import * as React from 'react'
import { assert } from 'chai'

import { createComposer, propTypeStub } from 'recompost'
import { render } from 'test/utils/render'

/**
 * Helper type for typechecking childContextTypes and contextTypes of
 * React components.
 */
export type ContextTypes<T extends { [k: string]: any }> = { [k in keyof T]: typeof propTypeStub }

interface FooContext {
  foo: number
}

describe('ComponentDecoratorBuilder::withPropFromContext()', () => {
  describe('for context passed as string (old React)', () => {
    it('it retrieves value from context and passes it as a prop', async () => {
      class ContextProvider extends React.Component<{}> {
        public static childContextTypes: ContextTypes<FooContext> = {
          foo: propTypeStub,
        }
  
        public getChildContext(): FooContext {
          return { foo: 123 }
        }
  
        public render() {
          return this.props.children
        }
      }
  
      const decorate = createComposer()
        .withPropFromContext('foo', (foo: number) => ({ foo }))
        .build()
  
      const Foo = decorate(({ foo }) => <div>Foo = {foo}</div>)
  
      const container = await render(
        <ContextProvider>
          <Foo />
        </ContextProvider>,
      )
  
      assert.strictEqual(container.innerHTML, '<div>Foo = 123</div>')
    })
  })

  describe('for new context API (React >= 16.3)', () => {
    it('it retrieves value from context and passes it as a prop', async () => {
      const MyContext = React.createContext<FooContext>({ foo: 123 })
  
      const decorate = createComposer()
        .withPropFromContext(MyContext, (ctxProp) => ({ foo: ctxProp.foo }))
        .build()
  
      const Foo = decorate(({ foo }) => <div>Foo = {foo}</div>)
  
      const container = await render(
        <Foo />
      )
  
      assert.strictEqual(container.innerHTML, '<div>Foo = 123</div>')
    })
  })
})
