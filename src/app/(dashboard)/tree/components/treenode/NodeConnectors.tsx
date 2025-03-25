// src/app/(dashboard)/tree/components/treenode/NodeConnectors.tsx

interface NodeConnectorsProps {
  hasOnlyOneChild: boolean;
}

export default function NodeConnectors({ hasOnlyOneChild }: NodeConnectorsProps) {
  return (
    <>
      {/* Vertical line from parent to children - single straight line */}
      <div className="h-16 w-[1px] bg-gray-300 dark:bg-gray-600"></div>

      {/* Horizontal line connecting children */}
      <div
        className={`relative ${
          hasOnlyOneChild ? "w-0" : "w-[180px] sm:w-[220px] md:w-[260px]"
        } h-[1px] bg-gray-300 dark:bg-gray-600`}
      >
        {/* Only show vertical connectors if there are two children */}
        {!hasOnlyOneChild && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-[1px] h-16 bg-gray-300 dark:bg-gray-600"></div>
            <div className="absolute right-0 top-0 bottom-0 w-[1px] h-16 bg-gray-300 dark:bg-gray-600"></div>
          </>
        )}
      </div>
    </>
  );
}