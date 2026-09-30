"use client";

import { Children, cloneElement, useLayoutEffect, useRef, useState } from "react";
import { getColumnCount, getMasonryLayout } from "@/lib/masonryLayout.mjs";

export default function BalancedMasonry({ items, columns, className, children }) {
  const containerRef = useRef(null);
  const [metrics, setMetrics] = useState(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = () => {
      const styles = getComputedStyle(container);
      const next = {
        width: container.clientWidth,
        columnCount: getColumnCount(columns, window.innerWidth),
        columnGap: parseFloat(styles.columnGap) || 0,
        rowGap: parseFloat(styles.rowGap) || 0,
      };
      setMetrics((previous) => previous && Object.keys(next).every(
        (key) => previous[key] === next[key]
      ) ? previous : next);
    };

    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [columns]);

  const layout = metrics?.width > 0 ? getMasonryLayout(items, metrics) : null;

  return (
    <div
      ref={containerRef}
      className={`relative grid ${className}`}
      style={layout
        ? { height: layout.height }
        : { gridTemplateColumns: `repeat(${columns.default}, minmax(0, 1fr))` }}
    >
      {Children.map(children, (child, index) => layout ? cloneElement(child, {
        // Keep DOM order and keys stable so keyboard navigation and lazy loading
        // still follow the original list when columns change on resize.
        style: {
          ...child.props.style,
          position: "absolute",
          left: layout.positions[index].left,
          top: layout.positions[index].top,
          width: layout.positions[index].width,
        },
      }) : child)}
    </div>
  );
}
