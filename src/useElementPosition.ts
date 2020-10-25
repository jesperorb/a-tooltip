import {
  useState,
  useEffect,
  RefObject,
  CSSProperties
} from "react";

export type Collisions = {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export type Position = {
  collisions: Collisions | null;
  style: CSSProperties;
}

type ElementPositionArguments = {
  triggerRef: RefObject<HTMLElement|null>;
  overlayRef: RefObject<HTMLElement|null>;
  visible: boolean;
}

/**
 * Helper function to calculate the position of the tooltip and the
 * height and width of the tooltip according to content using translate
 * @param content element which is hovered
 * @param tooltip the tooltip element
 * @returns if the element should be hidden and which sides the tooltip collide
 */
export const getPosition = (
  content: HTMLElement | null,
  tooltip: HTMLElement | null
): Position => {
  if (content && tooltip && window) {
    // Get width and height of the tooltip
    const tooltipHeight = tooltip.offsetHeight;
    const tooltipWidth = tooltip.offsetWidth;
    // Get height of actual content that is being hovered
    const contentHeight = content.offsetHeight;

    //Get position from left of screen
    const fromLeft = content.offsetLeft;
    // And from top of screen
    const fromTop = content.offsetTop;
    // Everyones favorite function
    const fromBottom = content.getBoundingClientRect().bottom;

    // Get dimensions of the window
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Calulating, zoop zoom
    const collisions = {
      top: fromTop - tooltipHeight < 0,
      right: windowWidth < fromLeft + tooltipWidth,
      bottom: windowHeight < fromBottom + tooltipHeight,
      left: fromLeft - tooltipWidth < 0
    };

    // Return possible collisions and set opacity to fade a bit
    return {
      collisions,
      style: {
        opacity: 1,
        top:
          collisions.bottom && !collisions.top
            ? fromTop - contentHeight - 10
            : fromTop + contentHeight + 8,
        left: fromLeft
      }
    };
  }
  // Set visibility to hidden if no refs have been passed
  return { collisions: null, style: { visibility: "hidden" } };
};

/**
 * Gets position of tooltip everytime either 'visible' (hover)
 * changes or when the element refs changes
 */
export function useElementPosition({
  triggerRef,
  overlayRef,
  visible
}: ElementPositionArguments) {
  const [elementPosition, setElementPosition] = useState<Position>(
    getPosition(triggerRef.current, overlayRef.current)
  );

  useEffect(() => {
    setElementPosition(getPosition(triggerRef.current, overlayRef.current));
  }, [overlayRef, triggerRef, visible]);

  return elementPosition;
}
