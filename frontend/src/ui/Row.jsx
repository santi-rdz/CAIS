const directions = {
  row: "items-center justify-between",
  col: "flex-col gap-4",
  "row-end": "grow justify-end gap-2",
};

export default function Row({ children, direction = "row" }) {
  return <div className={`flex ${directions[direction]}`}>{children}</div>;
}
