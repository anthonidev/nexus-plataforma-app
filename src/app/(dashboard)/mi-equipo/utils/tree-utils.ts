import { TreeNode } from "@/types/tree/tree.types";


export function findNodeById(rootNode?: TreeNode, id?: string): TreeNode | undefined {
  if (!rootNode || !id) return undefined;
  if (rootNode.id === id) return rootNode;

  if (rootNode.children?.left) {
    const foundInLeft = findNodeById(rootNode.children.left, id);
    if (foundInLeft) return foundInLeft;
  }

  if (rootNode.children?.right) {
    const foundInRight = findNodeById(rootNode.children.right, id);
    if (foundInRight) return foundInRight;
  }

  return undefined;
}