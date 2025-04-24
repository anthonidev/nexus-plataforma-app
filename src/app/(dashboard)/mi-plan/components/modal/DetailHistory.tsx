import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MembershipHistoryItem } from '@/types/plan/membership'
import { Database, RefreshCw, Tag } from 'lucide-react'
import { ActionIcon } from '../ActionBadge'


type Props = {
    isModalOpen: boolean;
    closeModal: () => void;
    selectedItem: MembershipHistoryItem;
}

const DetailHistory = ({ isModalOpen, closeModal, selectedItem }: Props) => {
    return (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ActionIcon action={selectedItem.action} />
                        Detalles de {selectedItem.action === "CREATED" ? "Creación" :
                            selectedItem.action === "RENEWED" ? "Renovación" :
                                selectedItem.action === "CANCELLED" ? "Cancelación" :
                                    selectedItem.action === "UPGRADED" ? "Actualización" :
                                        selectedItem.action === "DOWNGRADED" ? "Degradación" :
                                            selectedItem.action === "REACTIVATED" ? "Reactivación" :
                                                selectedItem.action === "EXPIRED" ? "Expiración" :
                                                    selectedItem.action === "STATUS_CHANGED" ? "Cambio de estado" :
                                                        selectedItem.action === "PAYMENT_RECEIVED" ? "Pago recibido" :
                                                            "Acción"}
                    </DialogTitle>
                    <DialogDescription>
                        ID #{selectedItem.id} - {new Date(selectedItem.createdAt).toLocaleString()}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3">
                    {selectedItem.notes && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <Tag className="h-4 w-4" /> Notas
                            </h4>
                            <p className="text-sm bg-muted/30 p-3 rounded-md">{selectedItem.notes}</p>
                        </div>
                    )}

                    {selectedItem.changes && Object.keys(selectedItem.changes).length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" /> Cambios realizados
                            </h4>
                            <div className="bg-muted/30 rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Campo</TableHead>
                                            <TableHead>Valor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(selectedItem.changes).map(([key, value]: [string, any]) => (
                                            <TableRow key={key}>
                                                <TableCell className="font-medium">{key}</TableCell>
                                                <TableCell className="font-medium">{value}</TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {selectedItem.metadata && Object.keys(selectedItem.metadata).length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <Database className="h-4 w-4" /> Metadata
                            </h4>
                            <div className="bg-muted/30 p-3 rounded-md">
                                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                                    {JSON.stringify(selectedItem.metadata, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={closeModal}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DetailHistory