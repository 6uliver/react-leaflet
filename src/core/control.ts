import { Control, ControlOptions } from 'leaflet'
import { useEffect, useRef } from 'react'

import { useLeafletContext } from './context'
import { UseLeafletElement } from './element'

export function createUseLeafletControl<
  E extends Control,
  P extends ControlOptions
>(useElement: UseLeafletElement<E, P>) {
  return function useLeafletControl(
    props: P,
  ): ReturnType<UseLeafletElement<E, P>> {
    const context = useLeafletContext()
    const elementRef = useElement(context, props)
    const positionRef = useRef(props.position)

    // Adding and removing
    useEffect(() => {
      if (elementRef.current === null || context == null) {
        return
      }
      const { el } = elementRef.current
      el.addTo(context.map)
      return () => {
        el.remove()
      }
    }, [context, elementRef])
    // Update
    useEffect(() => {
      if (
        elementRef.current !== null &&
        props.position != null &&
        props.position !== positionRef.current
      ) {
        elementRef.current.el.setPosition(props.position)
        positionRef.current = props.position
      }
    }, [elementRef, props])

    return elementRef
  }
}