import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import api from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import { Zone, TransporteEditResponse } from '@/types/transporte';
import { ZoneSelector } from '@/components/transportes/ZoneSelector';
import { ZoneSelectionDialog } from '@/components/transportes/ZoneSelectionDialog';
import { ZonesRelatedTable } from '@/components/transportes/ZonesRelatedTable';

export interface TransporteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editId?: string | null;
    onSaved: () => void;
}

const initialFields = { name: '', phone: '' };

export const TransporteDialog: React.FC<TransporteDialogProps> = ({ open, onOpenChange, editId, onSaved }) => {
    const [fields, setFields] = useState(initialFields);
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
    const [loading, setLoading] = useState(false);
    const [zones, setZones] = useState<Zone[]>([]);
    const [selectedZoneIds, setSelectedZoneIds] = useState<number[]>([]);
    const [zonesDialogOpen, setZonesDialogOpen] = useState(false);

    useEffect(() => {
        if (open && editId) {
            setLoading(true);
            api.get<TransporteEditResponse>(`/v1/transporte/edit/?id=${editId}`)
                .then(response => {
                    const data = response.data.data;
                    setFields({
                        name: data.transport.name,
                        phone: data.transport.phone
                    });
                    setZones(data.zones || []);
                    setSelectedZoneIds(data.transport_zones || []);
                })
                .catch(() => {
                    toast({
                        title: 'Error',
                        description: 'No se pudo obtener el transporte',
                        variant: 'destructive',
                    });
                    onOpenChange(false);
                })
                .finally(() => setLoading(false));
        } else if (open) {
            setFields(initialFields);
            setZones([]);
            setSelectedZoneIds([]);
            setErrors({});
        }
    }, [open, editId, onOpenChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            let response;
            if (editId) {
                response = await api.put(`/v1/transporte`, {
                    ...fields,
                    id: editId,
                    zones: selectedZoneIds
                });
            } else {
                response = await api.post(`/v1/transporte`, fields);
            }
            if (response.status === 200) {
                toast({
                    title: editId ? 'Transporte actualizado correctamente' : 'Transporte creado correctamente',
                    description: editId ? 'Transporte actualizado' : 'Transporte creado',
                    variant: 'default',
                });
                onOpenChange(false);
                setFields(initialFields);
                setSelectedZoneIds([]);
                onSaved();
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <ZoneSelectionDialog
                        open={zonesDialogOpen}
                        onOpenChange={setZonesDialogOpen}
                        zones={zones}
                        selectedZones={selectedZoneIds}
                        onSelectedZonesChange={setSelectedZoneIds}
                    />
                </div>
                <ZonesRelatedTable
                    zones={zones}
                    selectedZoneIds={selectedZoneIds}
                    onRemoveZone={(zoneId) => setSelectedZoneIds(prev => prev.filter(id => id !== zoneId))}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="flex-grow" type="button" variant="secondary" disabled={loading}>Cancelar</Button>
                    </DialogClose>
                    <Button className="flex-grow" variant='default' color='primary1' type="submit" form="dialog-form" disabled={loading} onClick={handleSubmit}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
