export function getColumnCount(columns, viewportWidth) {
  const breakpoint = Object.keys(columns)
    .filter((key) => key !== "default")
    .map(Number)
    .sort((a, b) => a - b)
    .find((width) => viewportWidth <= width);

  return columns[breakpoint] ?? columns.default ?? 1;
}

// Dimensions reserve the full image height before lazy-loaded images arrive.
export function getMasonryLayout(items, { width, columnCount, columnGap, rowGap }) {
  const columnWidth = Math.max(0, (width - columnGap * (columnCount - 1)) / columnCount);
  const heights = Array(columnCount).fill(0);

  const positions = items.map((item) => {
    const column = heights.indexOf(Math.min(...heights));
    const imageWidth = item.dimensions?.width || 700;
    const imageHeight = item.dimensions?.height || 500;
    const height = columnWidth * imageHeight / imageWidth;
    const position = {
      left: column * (columnWidth + columnGap),
      top: heights[column],
      width: columnWidth,
      height,
    };

    heights[column] += height + rowGap;
    return position;
  });

  return {
    positions,
    height: items.length ? Math.max(...heights) - rowGap : 0,
  };
}
