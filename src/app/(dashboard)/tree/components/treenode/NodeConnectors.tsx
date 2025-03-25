// src/app/(dashboard)/tree/components/TreeNode/NodeConnectors.tsx

interface NodeConnectorsProps {
  hasOnlyOneChild: boolean;
}

export default function NodeConnectors({ hasOnlyOneChild }: NodeConnectorsProps) {
  return (
    <>
      {/* Vertical line from parent to children */}
      <div className="h-8 w-px bg-border"></div>

      {/* Horizontal line connecting children */}
      <div
        className={`relative ${
          hasOnlyOneChild ? "w-0" : "w-[400px] sm:w-[500px] md:w-[700px]"
        } h-px bg-border`}
      >
        {/* Only show horizontal connectors if there are two children */}
        {!hasOnlyOneChild && (
          <>
            <div className="absolute left-0 top-0 h-4 w-px bg-border"></div>
            <div className="absolute right-0 top-0 h-4 w-px bg-border"></div>
          </>
        )}
      </div>
    </>
  );
}