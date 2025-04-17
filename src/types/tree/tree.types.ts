export interface TreeNode {
  id: string;
  email: string;
  referralCode: string;
  position: string;
  isActive: boolean;
  fullName?: string;
  depth: number;
  membership?: {
    plan?: {
      name: string;
    };
    status: string;
    startDate: string;
    endDate: string;
  };
  rank?: {
    currentRank?: {
      name: string;
      code: string;
    };
    highestRank: {
      name: string;
      code: string;
    };
  };
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
