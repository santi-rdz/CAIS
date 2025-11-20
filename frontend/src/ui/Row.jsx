const directions = {
  row: "items-center justify-between",
  col: "flex-col gap-4",
};

export default function Row({ children, direction = "row" }) {
  return <div className={`flex h-10 ${directions[direction]}`}>{children}</div>;
}
