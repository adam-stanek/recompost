import * as React from 'react'
import { createComposer } from 'recompost'

const enhance = createComposer<{ foo: string }>()
  .withProps(() => ({
    bar: false,
  }))
  .build()

enhance(props => {
  class ClassComponent extends React.Component<typeof props> {
    render() {
      // $ExpectType string
      this.props.foo

      // $ExpectType boolean
      this.props.bar

      return null
    }
  }

  return React.createElement(ClassComponent, props)
})
