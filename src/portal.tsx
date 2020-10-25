import * as React from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  key?: string | undefined | null;
  container?: string;
}

/**
 * Helper component to mount the tooltip outside of the hovered element
 * with the use of 'createPortal'. The tooltip will be rendered at the top node
 * instead of inside the element with the tooltip
 */
export const Portal: React.FC<PortalProps> = ({
  children,
  key,
  container = "#root"
}) => {
  const rootElement = document.querySelector(container);
  if (!rootElement) return null;
  return createPortal(children, rootElement, key);
};
