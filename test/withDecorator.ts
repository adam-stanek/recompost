import { createComposer, ComponentDecorator } from 'recompost'

declare const customDecorator: ComponentDecorator<
  { a: number; b: number },
  { result: number },
  'a' | 'b'
>

const enhance = createComposer<{ a: number; b: number }>()
  .withDecorator(customDecorator)
  .build()

enhance(({ children, ...props }) => {
  // $ExpectType { result: number; }
  props

  return null
})

// The decorator uses both props `a` and `b`, but it is applied on component which only
// declares `b`. This should cause an error.
createComposer<{ a: number }>()
  // $ExpectError Type 'ComponentClass<{ a: number; b: number; }>' provides no match for the signature '(props: { a: number; } & { children?: ReactNode; }, context?: any): ReactElement<any> | null'.
  .withDecorator(customDecorator)
  .build()
