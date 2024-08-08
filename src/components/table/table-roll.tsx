import { ComponentProps } from "react";

interface TableRollProps extends ComponentProps<"tr"> {}

export function TableRoll(props: TableRollProps) {
  return (
    <tr {...props} className="border-b border-white/10 hover:bg-white/5" />
  );
}
