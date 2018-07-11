import { createComposer, ComponentDecorator } from 'recompost'

const enhance = createComposer<{ a: number }>()
  .withProps(({ a }) => ({ c: a * a }))
  .withDecorator<{ b: string }>(null as any)
  .build()

enhance(({ children, ...props }) => {
  // $ExpectType { a: number; c: number; b: string; }
  props

  return null
})

// Check that if we pass the decorator with `any` typing it doesn't break anything
const enhance2 = createComposer<{ a: number }>()
  .withProps(({ a }) => ({ c: a * a }))
  .withDecorator(null as any)
  .build()

enhance2(({ children, ...props }) => {
  // $ExpectType { a: number; c: number; }
  props

  return null
})
