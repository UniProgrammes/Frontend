import { Node, NodeProps } from "@xyflow/react";
import { BaseNode } from "~/components/base-node";

type LabeledGroupNode = Node<{
  label: string;
  style?: React.CSSProperties;
}>;

export function LabeledGroupNode({ data, selected }: NodeProps<LabeledGroupNode>) {
  return (
    <BaseNode
      selected={selected}
      className="bg-white bg-opacity-50 h-full rounded-sm overflow-hidden p-0" 
    >
      {data.label && (
        <div
          style={{ ...data.style }} className="bg-gray-200 w-fit p-2 text-xs rounded-br-sm bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50" >
          {data.label}
        </div>
      )}
    </BaseNode>
  );
}

LabeledGroupNode.displayName = "LabeledGroupNode";
