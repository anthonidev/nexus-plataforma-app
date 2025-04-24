import { PaymentImageViewer } from "@/components/common/payments/PaymentImageViewer";

import { PaymentResponse, ResponseApprovePayment, ResponseRejectPayment } from "@/types/payment/payment-detail.type";
import { ApprovePaymentModal } from "../../../components/modals/ApprovePaymentModal";
import { PaymentResponseModal } from "../../../components/modals/PaymentResponseModal";
import { RejectPaymentModal } from "../../../components/modals/RejectPaymentModal";

interface PaymentDetailModalsProps {
    payment: PaymentResponse;
    isApproveModalOpen: boolean;
    isRejectModalOpen: boolean;
    isResponseModalOpen: boolean;
    isSubmitting: boolean;
    rejectionReason: string;
    setRejectionReason: (reason: string) => void;
    selectedImageUrl: string | null;
    approveResponse: ResponseApprovePayment | null;
    rejectResponse: ResponseRejectPayment | null;
    closeModals: () => void;
    handleApprovePayment: (approvalData: {
        codeOperation: string;
        banckName: string;
        dateOperation: string;
        numberTicket: string;
    }) => Promise<unknown>;
    handleRejectPayment: () => Promise<unknown>;
    closeResponseModal: () => void;
    navigateToPaymentsList: () => void;
    onCloseImageViewer: () => void;
}

export default function PaymentDetailModals({
    payment,
    isApproveModalOpen,
    isRejectModalOpen,
    isResponseModalOpen,
    isSubmitting,
    rejectionReason,
    setRejectionReason,
    selectedImageUrl,
    approveResponse,
    rejectResponse,
    closeModals,
    handleApprovePayment,
    handleRejectPayment,
    closeResponseModal,
    navigateToPaymentsList,
    onCloseImageViewer,
}: PaymentDetailModalsProps) {
    return (
        <>
            <ApprovePaymentModal
                isOpen={isApproveModalOpen}
                onClose={closeModals}
                onApprove={handleApprovePayment}
                payment={payment}
                isSubmitting={isSubmitting}
            />

            <RejectPaymentModal
                isOpen={isRejectModalOpen}
                onClose={closeModals}
                onReject={handleRejectPayment}
                payment={payment}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                isSubmitting={isSubmitting}
            />

            <PaymentResponseModal
                isOpen={isResponseModalOpen}
                onClose={closeResponseModal}
                approveResponse={approveResponse}
                rejectResponse={rejectResponse}
                onViewAllPayments={navigateToPaymentsList}
            />

            {selectedImageUrl && (
                <PaymentImageViewer
                    imageUrl={selectedImageUrl}
                    onClose={onCloseImageViewer}
                />
            )}
        </>
    );
}