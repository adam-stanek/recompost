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
  // $ExpectError Type 'DecoratedSFC<Pick<DecoratedComponentProps<TActualInitialProps, { result: number; }, "a" | "b">, "...' provides no match for the signature 'new (props: Pick<DecoratedComponentProps<{ a: number; b: number; }, { result: number; }, "a" | "b">, "result">, context?: any): Component<any, any, never>'.
  .withDecorator(customDecorator)
  .build()
