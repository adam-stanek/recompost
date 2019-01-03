import { createComposer } from 'recompost'

const enhance = createComposer<{ foo: string }>()
  .withProps(() => ({
    bar: false,
  }))
  .buildClassDecorator()

enhance(
  BaseComponent =>
    class extends BaseComponent {
      render() {
        // $ExpectType string
        this.props.foo

        // $ExpectType boolean
        this.props.bar

        return null
      }
    },
)
