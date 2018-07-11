import { createComposer } from 'recompost'

const enhance = createComposer<{}>()
  .withStatic({ foo: 55, bar: ['string'] })
  .build()

const TestComponent = enhance(props => null)

// $ExpectType number
TestComponent.foo

// $ExpectType string[]
TestComponent.bar
