export interface TreeNode {
  id: string;
  email: string;
  referralCode: string;
  position: string;
  isActive: boolean;
  fullName?: string;
  depth: number;
  children?: {
    left?: TreeNode;
    right?: TreeNode;
  };
}

export interface NodeContext {
  node: TreeNode;

  ancestors: TreeNode[];

  siblings?: {
    left?: {
      id: string;
      email: string;
      referralCode: string;
    };
    right?: {
      id: string;
      email: string;
      referralCode: string;
    };
  };
}

export interface GetUserTreeResponse {
  tree: TreeNode;
  metadata: {
    queryDurationMs: number;
    requestedDepth: number;
    rootUserId: string;
  };
}

export interface GetNodeWithContextResponse extends NodeContext {
  metadata: {
    queryDurationMs: number;
    requestedNodeId: string;
    descendantDepth: number;
    ancestorDepth: number;
  };
}
