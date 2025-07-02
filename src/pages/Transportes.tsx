
import React, { useState } from 'react';
import api from '@/hooks/useApi';
import { useDialog } from '@/contexts/DialogContext';
import { useTransportes } from '@/hooks/useTransportes';
import { TransportesList } from '@/components/transportes/TransportesList';
import { TransportesPagination } from '@/components/transportes/TransportesPagination';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { TransporteDialog } from '@/components/transportes/TransporteDialog';
import SearchWithFilters, { FilterComponent, InputSearchFilter } from '@/components/ui/SearchWithFilters';

const Transportes: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const { data, isLoading, error, refetch } = useTransportes(currentPage, searchValue);

    // Estado para el formulario de transporte
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null); // null para crear, id para editar
    const { showDialog } = useDialog();

    // Para abrir el dialog en modo crear
    const openCreateDialog = () => {
        setEditId(null);
        setDialogOpen(true);
    };

    // Para abrir el dialog en modo editar
    const openEditDialog = (id: string) => {
        setEditId(id);
        setDialogOpen(true);
    };


    // Eliminar transporte usando DialogContext
    const handleDelete = (id: string) => {
        showDialog({
            title: '¿Eliminar transporte?',
            description: 'Esta acción no se puede deshacer.',
            type: 'danger',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await api.delete(`/v1/transporte/?id=${id}`);
                    toast({
                        title: 'Transporte eliminado',
                        variant: 'default',
                    });
                    refetch();
                } catch (err) {
                    toast({
                        title: 'Error',
                        description: 'No se pudo eliminar el transporte',
                        variant: 'destructive',
                    });
                }
            },
        });
    };


    const transportes = data?.data?.data?.data || [];
    const paginationInfo = data?.data?.data;

    const [filters, setFilters] = useState<FilterComponent>({});
    const [stagedFilters, setStagedFilters] = useState<FilterComponent>({});
    const [showDialogFilters, setShowDialogFilters] = useState(false);
    const filterItems: InputSearchFilter[] = []; // O tu estructura real de filtros

    // Handlers para eventos
    const handleClearFilters = () => setFilters({});
    const handleApplyFilters = () => setFilters(stagedFilters);
    const handleRefreshData = () => refetch();
    const handleSelectItem = (subItemId: string | number, value?: unknown) => {
        // Implementar lógica según tu filtro
    };
    const handleClickAddBtn = (type: "desktop" | "mobile") => {
        openCreateDialog();
    };

    return (
        <div className="h-full flex flex-col p-3 overflow-hidden">
            <div className="mb-6">
                <TransporteDialog
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) setEditId(null);
                    }}
                    editId={editId}
                    onSaved={refetch}
                />
                <SearchWithFilters
                    items={filterItems}
                    value={searchValue}
                    onSearch={setSearchValue}
                    filters={filters}
                    onChangeFilters={setFilters}
                    stagedFilters={stagedFilters}
                    onChangeStagedFilters={setStagedFilters}
                    showDialogFilters={showDialogFilters}
                    setShowDialogFilters={setShowDialogFilters}
                    inputPlaceholder="Buscar transporte...."
                    title="Transportes"
                    titleDialogFilters="Filtrar"
                    textAddButton="Crear transporte"
                    textAddButtonMobile="Crear transporte"
                    onClearFilters={handleClearFilters}
                    onApplyFilters={handleApplyFilters}
                    onRefreshData={handleRefreshData}
                    onSelectItem={handleSelectItem}
                    onClickAddBtn={handleClickAddBtn}
                />
            </div>
            <div className="flex flex-col flex-1">
                {error && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-red-500">Error al cargar los transportes</div>
                    </div>
                )}
                {(!error && transportes.length > 0) ? (
                    <>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-gray-500">Cargando transportes...</div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col flex-1 min-h-0">
                                <div className="flex-1 overflow-auto">
                                    <TransportesList 
                                        transportes={transportes} 
                                        onRowClick={(transporte) => openEditDialog(transporte.id.toString())} 
                                        handleDelete={(id) => handleDelete(id)}
                                    />
                                </div>
                                {paginationInfo && paginationInfo.last_page > 1 && (
                                    <div className="mt-4">
                                        <TransportesPagination
                                            currentPage={paginationInfo.current_page}
                                            lastPage={paginationInfo.last_page}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (!error && !isLoading && (
                    <div className="bg-neutral1 rounded-lg shadow-sm border p-12 text-center">
                        <div className="text-neutral5">
                            <div className="text-lg font-medium mb-2">No hay transportes</div>
                            <div>No se encontraron transportes en el sistema</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Transportes;
