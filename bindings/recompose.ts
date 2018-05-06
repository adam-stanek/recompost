// This file contains bindings against recompose library

import * as React from 'react'
import {
  getContext,
  onlyUpdateForKeys,
  shouldUpdate,
  withHandlers,
  mapProps,
  withProps,
  withPropsOnChange,
  withState,
  pure,
  lifecycle,
  setDisplayName,
} from 'recompose'
import omit from 'lodash.omit'

import {
  ComponentDecoratorBuilder,
  ComponentDecorator,
  LifecycleMethods,
} from '../abstract'

const identity = <T>(value: T) => value

// This is a stub for a React propTypes validator. We don't use propTypes with react
// but we still need to be able to set context requirements.
const propTypeStub: React.Validator<any> = () => null

const createDefaultProps = (a: object | undefined, b: object | undefined) =>
  a && b ? Object.assign({}, a, b) : a || b

const createWrapper = (fn: any) => {
  return function(this: any, ...args: any[]) {
    return new RecompactComponentDecoratorBuilder( // tslint:disable-line
      [...this.funcs, fn(...args)],
      this.defaultProps,
    )
  } as any
}

// noinspection Annotator
class RecompactComponentDecoratorBuilder<
  TInitialProps,
  TResultingProps = never,
  TOmittedProps extends string = never
> {
  // Wrapped recompose functions
  public withProps = createWrapper(withProps)
  public withPropsOnChange = createWrapper(withPropsOnChange)
  public withState = createWrapper(withState)
  public onlyUpdateForKeys = createWrapper(onlyUpdateForKeys)
  public shouldUpdate = createWrapper(shouldUpdate)
  public withHandlers = createWrapper(withHandlers)
  public withDisplayName = createWrapper(setDisplayName)

  public append = ((another: RecompactComponentDecoratorBuilder<any>) => {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, ...another.funcs],
      createDefaultProps(this.defaultProps, another.defaultProps),
    )
  }) as any

  public withDefaultProps = ((defaultProps: {}) => {
    return new RecompactComponentDecoratorBuilder(
      this.funcs,
      this.defaultProps
        ? { ...(this.defaultProps as {}), ...defaultProps }
        : defaultProps,
    )
  }) as any

  constructor(
    private funcs: any[],
    private defaultProps?: Partial<TInitialProps>,
  ) {}

  public withDecorator(decorator: any) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, decorator],
      this.defaultProps,
    )
  }

  public withHandler(k: string, f: any) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, withHandlers({ [k]: f })],
      this.defaultProps,
    )
  }

  public omitProps(keys: string | string[]) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, mapProps((props: {}) => omit(props, keys))],
      this.defaultProps,
    )
  }

  public withPropFromContext(propName: string) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, getContext({ [propName]: propTypeStub })],
      this.defaultProps,
    )
  }

  public withLifecycle(lifecycleMethods: LifecycleMethods<any>) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, lifecycle(lifecycleMethods)],
      this.defaultProps,
    )
  }

  public pure() {
    return new RecompactComponentDecoratorBuilder<
      TInitialProps,
      TResultingProps,
      TOmittedProps
    >([...this.funcs, pure], this.defaultProps)
  }

  public build(): ComponentDecorator<
    TInitialProps,
    TResultingProps,
    TOmittedProps
  > {
    return ((component: React.SFC<any> | React.ComponentClass<any>) => {
      // Apply all the decorators
      const enhancedComponent = this.funcs.reduce(
        (a, b) => (...args: any[]) => a(b(...args)),
        identity,
      )(component) as React.ComponentClass<any>

      // Set defaultProps on the enhanced component while copying the defaultProps of the original component
      enhancedComponent.defaultProps = createDefaultProps(
        component.defaultProps,
        this.defaultProps,
      )

      return enhancedComponent
    }) as any
  }
}

export function createComposer<T>(): ComponentDecoratorBuilder<T> {
  return new RecompactComponentDecoratorBuilder([]) as any
}
