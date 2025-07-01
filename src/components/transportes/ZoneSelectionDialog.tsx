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
                                <TableHead>Zonas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {zones.length > 0 ? (
                                zones.map(zone => {
                                    const isSelected = tempSelectedZones.includes(zone.id);
                                    const toggleZoneSelection = (e: React.MouseEvent) => {
                                        // Prevenir que el clic se propague si se hace clic en el checkbox directamente
                                        if ((e.target as HTMLElement).tagName === 'INPUT') return;
                                        
                                        setTempSelectedZones(prev =>
                                            isSelected
                                                ? prev.filter(id => id !== zone.id)
                                                : [...prev, zone.id]
                                        );
                                    };
                                    
                                    return (
                                        <TableRow 
                                            key={zone.id}
                                            onClick={toggleZoneSelection}
                                            className="cursor-pointer hover:bg-gray-50"
                                        >
                                            <TableCell>
                                                <div className="flex items-start gap-2">
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
                                                        className="h-4 w-4 mt-1"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div>
                                                        <div className="text-neutral6 text-[12px]">
                                                            {zone.name}
                                                        </div>
                                                        <div className="text-neutral5 font-light text-[12px]">
                                                            {zone.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
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
