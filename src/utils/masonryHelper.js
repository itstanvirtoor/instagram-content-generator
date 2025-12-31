// Masonry layout helper - calculates grid row span for each item
export const calculateMasonrySpan = (element) => {
  if (!element) return 1;
  
  const rowHeight = 10; // Must match grid-auto-rows
  const rowGap = 25; // Must match gap
  const itemHeight = element.getBoundingClientRect().height;
  
  return Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
};
