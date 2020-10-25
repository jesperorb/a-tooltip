import * as React from "react";
import { Portal } from './portal';

import "./tooltip.css";

import {
  Collisions,
  useElementPosition
} from "./useElementPosition";

export type TooltipProps = {
  /** Text to be displayed in tooltip, every item if array will be on new line */
  text: string | string[];
  /** Id to used by 'aria-describedby' */
  id: string;
  /** Optional if you want to render the tooltip in something other than '#root' */
  container?: string;
  /** Used to set the tooltip to open at start (only now used in documentation) */
  open?: boolean;
}

export type TooltipPopupProps = {
  /** Text to display in tooltip recieved from parent */
  text: string | string[];
  /** If the tooltip is visible */
  visible: boolean;
  /** A reference to the element that is being hovered or focused */
  triggerRef: React.RefObject<HTMLElement|null>;
  /** Used to link 'aria-describedby' */
  id: string;
  /** Optional if you want to render the tooltip in something other than '#root' */
  container?: string;
  /** Used to set the tooltip to open at start (only now used in documentation) */
  open?: boolean;
}

/**
 * A tooltip that accepts anything as children and displays
 * a text tooltip on hover and on focus
 * Closes tooltip on 'Esc' or on mouse out
 * @param {TooltipProps} TooltipProps
 * @example
 * <Tooltip id="tooltipsy" text="Hover me">
 *  <div>Hello it's me</div>
 * </Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  id,
  open,
  ...rest
}) => {
  const triggerRef = React.useRef<HTMLElement|null>(null);

  const [visible, setVisible] = React.useState(() => Boolean(open));

  const show = (): void => {
    if (!visible) setVisible(true);
  };

  const hide = (): void => {
    if (visible) setVisible(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    if(event.key === "Escape") setVisible(false);
  }

  const tooltipId = `a_tooltip_${id}`;
  return (
    <>
      {React.cloneElement(
        React.Children.only(children) as React.ReactElement,
        {
          ref: triggerRef,
          "aria-describedby": tooltipId,
          onMouseOver: show,
          onMouseEnter: show,
          onMouseLeave: hide,
          onMouseOut: hide,
          onFocus: show,
          onBlur: hide,
          onKeyDown
        }
      )}
      <TooltipPopup
        {...rest}
        id={tooltipId}
        triggerRef={triggerRef}
        visible={visible}
      />
    </>
  );
};

/**
 * The tooltip that is displayed, used internally by Tooltip
 */
const TooltipPopup: React.FC<TooltipPopupProps> = ({
  id,
  text,
  triggerRef,
  visible,
  container,
}) => {
  const overlayRef = React.useRef<HTMLElement | null>(null);

  const { style, collisions } = useElementPosition({
    triggerRef,
    overlayRef,
    visible
  });

  if (!visible) return null;
  return (
    <Portal container={container}>
      <div
        className={"tooltip"}
        id={id}
        ref={node => (overlayRef.current = node)}
        role="tooltip"
        style={style}
      >
        <div
          className={getArrow(collisions)}
        >
          {Array.isArray(text)
            ? <>{text.map(t => <div>{t}</div>)}</>
            : text
          }
        </div>
      </div>
    </Portal>
  );
};

/**
 * Display the tooltip arrow on top or bottom depending on
 * position of tooltip, uses collisions from 'useElementPosition'
 */
const getArrow = (collisions: Collisions | null): string => {
  return collisions && collisions.bottom && !collisions.top
    ? "tooltip__arrow tooltip__arrow--bottom"
    : "tooltip__arrow tooltip__arrow--top";
};