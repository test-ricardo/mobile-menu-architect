import React from 'react';
import { Zone } from '@/types/transporte';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ZoneSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    zones: Zone[];
    selectedZones: number[];
    onSelectedZonesChange: (zones: number[]) => void;
}

export const ZoneSelectionDialog: React.FC<ZoneSelectionDialogProps> = ({
    open,
    onOpenChange,
    zones,
    selectedZones,
    onSelectedZonesChange
}) => {
    const [tempSelectedZones, setTempSelectedZones] = React.useState<number[]>([]);

    // Inicializar zonas temporales cuando se abre el diálogo
    React.useEffect(() => {
        if (open) {
            setTempSelectedZones([...selectedZones]);
        }
    }, [open, selectedZones]);

    const handleSave = () => {
        onSelectedZonesChange(tempSelectedZones);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-primary1 text-[16px] font-semibold mb-4">
                        Relacionar Zonas
                    </DialogTitle>
                </DialogHeader>
                
                <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">Seleccionar</TableHead>
                                <TableHead>Nombre de Zona</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {zones.length > 0 ? (
                                zones.map(zone => {
                                    const isSelected = tempSelectedZones.includes(zone.id);
                                    return (
                                        <TableRow key={zone.id}>
                                            <TableCell className="text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        setTempSelectedZones(prev => 
                                                            isSelected 
                                                                ? prev.filter(id => id !== zone.id) 
                                                                : [...prev, zone.id]
                                                        );
                                                    }}
                                                    className="h-4 w-4"
                                                />
                                            </TableCell>
                                            <TableCell>{zone.name}</TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                        No hay zonas disponibles
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <Button 
                        onClick={handleSave}
                        variant="default" 
                        color="primary1"
                    >
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
