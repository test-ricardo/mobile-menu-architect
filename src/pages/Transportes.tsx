
import React, { useState } from 'react';
import { useDialog } from '@/contexts/DialogContext';
import { useTransportes } from '@/hooks/useTransportes';
import { TransportesList } from '@/components/transportes/TransportesList';
import { TransportesPagination } from '@/components/transportes/TransportesPagination';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogClose, DialogTitle } from '@/components/ui/dialog';
import api from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import { Zone, Transporte, TransporteEditResponse } from '@/types/transporte';
import { Badge } from '@/components/ui/badge';
import { ZoneSelectionDialog } from '@/components/transportes/ZoneSelectionDialog';
import { ZonesRelatedTable } from '@/components/transportes/ZonesRelatedTable';
import { ZoneSelector } from '@/components/transportes/ZoneSelector';

const Transportes: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, error, refetch } = useTransportes(currentPage);

    // Estado para el formulario de transporte
    const [fields, setFields] = useState({ name: '', phone: '' });
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null); // null para crear, id para editar
    const [zones, setZones] = useState<Zone[]>([]);
    const [selectedZoneIds, setSelectedZoneIds] = useState<number[]>([]);
    const [zonesDialogOpen, setZonesDialogOpen] = useState(false);
    const { showDialog } = useDialog();

    // Maneja cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    // Maneja submit del formulario (crear o editar)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            let response;
            if (editId) {
                // Editar
                response = await api.put(`/v1/transporte`, { 
                    ...fields, 
                    id: editId,
                    zones: selectedZoneIds 
                });
            } else {
                // Crear
                response = await api.post(`/v1/transporte`, fields);
            }
            if (response.status === 200) {
                toast({
                    title: editId ? 'Transporte actualizado correctamente' : 'Transporte creado correctamente',
                    description: editId ? 'Transporte actualizado' : 'Transporte creado',
                    variant: 'default',
                });
                setDialogOpen(false);
                setFields({ name: '', phone: '' });
                setSelectedZoneIds([]);
                setEditId(null);
                refetch();
            }
        } catch (err: any) {
            if (err.response?.status === 400) {
                setErrors(err.response?.data?.data || {});
            } else {
                toast({
                    title: 'Error',
                    description: 'No se pudo guardar el transporte',
                    variant: 'destructive',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Para abrir el dialog en modo crear
    const openCreateDialog = async () => {
        setFields({ name: '', phone: '' });
        setEditId(null);
        setSelectedZoneIds([]);
        setDialogOpen(true);
    };

    // Para abrir el dialog en modo editar (consulta la API por el id)
    const openEditDialog = async (id: string) => {
        setLoading(true);
        try {
            // Cargar datos del transporte con tipado fuerte
            const [transportResponse] = await Promise.all([
                api.get<TransporteEditResponse>(`/v1/transporte/edit/?id=${id}`)
            ]);
            
            const responseData = transportResponse.data.data;
            
            if (responseData.zones) {
                setZones(responseData.zones);
            }
            
            // Guardar datos del transporte
            setFields({ 
                name: responseData.transport.name, 
                phone: responseData.transport.phone 
            });
            setEditId(responseData.transport.id.toString());
            
            // Guardar zonas seleccionadas
            setSelectedZoneIds(responseData.transport_zones || []);
            
            setDialogOpen(true);
        } catch (err) {
            toast({
                title: 'Error',
                description: 'No se pudo obtener el transporte',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
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


    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Cargando transportes...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-500">Error al cargar los transportes</div>
                </div>
            </div>
        );
    }

    const transportes = data?.data?.data?.data || [];
    const paginationInfo = data?.data?.data;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transportes</h1>
                </div>

                {/* Botón para abrir Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center space-x-2 bg-primary1 hover:bg-primary/80 font-medium text-[16px]"
                            onClick={openCreateDialog}
                        >
                            <Plus className="h-4 w-4" />
                            Crear Transporte
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-primary1 text-[16px] font-semibold mb-4">
                                {editId ? 'Editar Transporte' : 'Crear Transporte'}
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            id="dialog-form"
                            className="flex flex-col gap-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="name" className="text-neutral5 text-[14px] mb-2">Nombre</label>
                                    <input
                                        className={`border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
                                        placeholder="Nombre"
                                        name="name"
                                        value={fields.name}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 text-xs mt-1">{errors.name}</span>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="phone" className="text-neutral5 text-[14px] mb-2">Teléfono</label>
                                    <input
                                        className={`border rounded px-3 py-2 ${errors.phone ? 'border-red-500' : ''}`}
                                        placeholder="Teléfono"
                                        name="phone"
                                        value={fields.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {errors.phone && (
                                        <span className="text-red-500 text-xs mt-1">{errors.phone}</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <ZoneSelector
                                    zones={zones}
                                    selectedZoneIds={selectedZoneIds}
                                    onAddZone={(zoneId) => setSelectedZoneIds(prev => [...prev, zoneId])}
                                    onOpenZoneDialog={() => setZonesDialogOpen(true)}
                                />
                            </div>
                        </form>
                        <div className="mt-[20px] mb-[20px] flex justify-end">
                            {/* Dialog para relacionar zonas usando el componente modular */}
                            <ZoneSelectionDialog 
                                open={zonesDialogOpen}
                                onOpenChange={setZonesDialogOpen}
                                zones={zones}
                                selectedZones={selectedZoneIds}
                                onSelectedZonesChange={setSelectedZoneIds}
                            />
                        </div>
                        {/* Tabla de zonas relacionadas usando el componente modular */}
                        <ZonesRelatedTable 
                            zones={zones}
                            selectedZoneIds={selectedZoneIds}
                            onRemoveZone={(zoneId) => setSelectedZoneIds(prev => prev.filter(id => id !== zoneId))}
                        />
                        <DialogFooter>
                            {/* Dropdown menu con opcion de eliminar transporte */}
                            <DialogClose asChild>
                                <Button className="flex-grow" type="button" variant="secondary" disabled={loading}>Cancelar</Button>
                            </DialogClose>
                            {/* <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" type="button">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top">
                                    <DropdownMenuItem>Eliminar transporte</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu> */}
                            <Button className="flex-grow" variant='default' color='primary1' type="submit" form="dialog-form" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {transportes.length > 0 ? (
                <>
                    <TransportesList 
                        transportes={transportes} 
                        onRowClick={(transporte) => openEditDialog(transporte.id.toString())} 
                        handleDelete={(id) => handleDelete(id)}
                    />

                    {paginationInfo && paginationInfo.last_page > 1 && (
                        <TransportesPagination
                            currentPage={paginationInfo.current_page}
                            lastPage={paginationInfo.last_page}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <div className="text-gray-500">
                        <div className="text-lg font-medium mb-2">No hay transportes</div>
                        <div>No se encontraron transportes en el sistema</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transportes;
