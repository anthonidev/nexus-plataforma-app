"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import MembershipDetail from "./components/MembershipDetail";
import { MembershipHistoryTable } from "./components/MembershipHistoryTable";
import { useMyMembership } from "./hooks/useMyMembership";

export default function MyPlanPage() {
  const {
    membership,
    membershipLoading,
    membershipError,

    historyItems,
    historyLoading,
    historyError,
    historyMeta,

    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  } = useMyMembership();

  return (
    <div className="container pt-8">
      <PageHeader
        title="Mi Plan"
        subtitle="Información detallada de tu membresía y su historial"
        variant="gradient"
      />

      <MembershipDetail
        membership={membership}
        isLoading={membershipLoading}
        error={membershipError}
      />

      <Card >
        <CardContent>
          <MembershipHistoryTable
            historyItems={historyItems}
            isLoading={historyLoading}
            error={historyError}
            pageSize={itemsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handleItemsPerPageChange}
            pageCount={historyMeta?.totalPages || 0}
            pageIndex={currentPage}
            totalItems={historyMeta?.totalItems || 0}
          />
        </CardContent>
      </Card>
    </div>

  );
}
