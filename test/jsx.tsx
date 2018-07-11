import * as React from 'react'
import { createComposer } from 'recompost'

// This test serves as a proof that the resulting component type can be used
// with JSX and is correctly typed.

const enhance = createComposer<{ foo: string }>()
  .build()

const TestComponent = enhance(() => null)

// $ExpectError
const test = <TestComponent foo={123} />
