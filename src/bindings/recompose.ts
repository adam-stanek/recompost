// This file contains bindings against recompose library

import * as React from 'react'
import {
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
  DecoratedComponent,
} from '../abstract'

const identity = <T>(value: T) => value

// This is a stub for a React propTypes validator. We don't use propTypes with react
// but we still need to be able to set context requirements.
export const propTypeStub: React.Validator<any> = () => null

const safelyMergeObj = (a: object | undefined, b: object | undefined) =>
  a && b ? Object.assign({}, a, b) : a || b

const createWrapper = (fn: any) => {
  return function(this: any, ...args: any[]) {
    return new RecompactComponentDecoratorBuilder( // tslint:disable-line
      [...this.funcs, fn(...args)],
      this.defaultProps,
      this.staticProps,
    )
  }
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
  public onlyUpdateForProps = createWrapper(onlyUpdateForKeys)
  public shouldUpdate = createWrapper(shouldUpdate)
  public withHandlers = createWrapper(withHandlers)
  public withDisplayName = createWrapper(setDisplayName)

  public append = (another: RecompactComponentDecoratorBuilder<any>) => {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, ...another.funcs],
      safelyMergeObj(this.defaultProps, another.defaultProps),
      safelyMergeObj(this.staticProps, another.staticProps),
    )
  }

  public withDefaultProps = (defaultProps: {}) => {
    return new RecompactComponentDecoratorBuilder(
      this.funcs,
      this.defaultProps
        ? { ...(this.defaultProps as {}), ...defaultProps }
        : defaultProps,
      this.staticProps,
    )
  }

  public withStatic = (staticProps: { [k: string]: any }) => {
    return new RecompactComponentDecoratorBuilder(
      this.funcs,
      this.defaultProps,
      this.staticProps ? { ...this.staticProps, ...staticProps } : staticProps,
    )
  }

  constructor(
    private funcs: any[],
    private defaultProps: Partial<TInitialProps> | undefined,
    private staticProps: { [k: string]: any } | undefined,
  ) {}

  public withDecorator(decorator: any) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, decorator],
      this.defaultProps,
      this.staticProps,
    )
  }

  public withHandler(k: string, f: any) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, withHandlers({ [k]: f })],
      this.defaultProps,
      this.staticProps,
    )
  }

  public omitProps(keys: string | string[]) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, mapProps((props: {}) => omit(props, keys))],
      this.defaultProps,
      this.staticProps,
    )
  }

  public withPropFromContext(
    propNameOrReactCtx: string | React.Context<any>,
    mapper: (ctxProp: any, props: any) => {},
  ) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, withPropFromContext(propNameOrReactCtx, mapper)],
      this.defaultProps,
      this.staticProps,
    )
  }

  public withLifecycle(lifecycleMethods: LifecycleMethods<any>) {
    return new RecompactComponentDecoratorBuilder(
      [...this.funcs, lifecycle(lifecycleMethods)],
      this.defaultProps,
      this.staticProps,
    )
  }

  public pure() {
    return new RecompactComponentDecoratorBuilder<
      TInitialProps,
      TResultingProps,
      TOmittedProps
    >([...this.funcs, pure], this.defaultProps, this.staticProps)
  }

  public build() {
    return (component: React.SFC<any> | React.ComponentClass<any>) => {
      // Apply all the decorators
      const enhancedComponent = this.funcs.reduce(
        (a, b) => (...args: any[]) => a(b(...args)),
        identity,
      )(component) as React.ComponentClass<any>

      // Set defaultProps on the enhanced component while copying the defaultProps of the original component
      enhancedComponent.defaultProps = safelyMergeObj(
        component.defaultProps,
        this.defaultProps,
      )

      if (this.staticProps) {
        for (const k in this.staticProps) {
          ;(enhancedComponent as { [k: string]: any })[k] = this.staticProps[k]
        }
      }

      return enhancedComponent
    }
  }
}

export function createComposer<T>(): ComponentDecoratorBuilder<T> {
  return new RecompactComponentDecoratorBuilder([], undefined, undefined) as any
}

/**
 * Custom withPropFromContext decorator because `getContext` from `recompose`
 * doesn't support new React context and doesn't provide way to specify mapper function.
 */
function withPropFromContext(
  propNameOrReactCtx: string | React.Context<any>,
  mapper: (ctxProp: any, props: any) => {},
) {
  if (typeof propNameOrReactCtx === 'string') {
    return (BaseComponent: React.ComponentType<any> | string) => {
      const withPropFromContext: React.SFC<any> = (
        { children, ...props },
        context,
      ) =>
        React.createElement(
          BaseComponent,
          { ...props, ...mapper(context[propNameOrReactCtx], props) },
          children,
        )

      withPropFromContext.contextTypes = {
        [propNameOrReactCtx]: propTypeStub,
      }

      return withPropFromContext
    }
  } else {
    return (BaseComponent: React.ComponentType<any> | string) => {
      const withPropFromContext = ({ children, ...props }: any) =>
        React.forwardRef((props, ref) =>
          React.createElement(
            propNameOrReactCtx.Consumer,
            undefined,
            (ctxProp: any) =>
              React.createElement(
                BaseComponent,
                {
                  ...props,
                  ...mapper(ctxProp, props),
                  ref,
                },
                children,
              ),
          ),
        )

      return withPropFromContext
    }
  }
}
