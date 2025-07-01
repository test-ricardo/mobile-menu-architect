import React from 'react';
import { Zone } from '@/types/transporte';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface ZonesRelatedTableProps {
    zones: Zone[];
    selectedZoneIds: number[];
    onRemoveZone: (zoneId: number) => void;
}

export const ZonesRelatedTable: React.FC<ZonesRelatedTableProps> = ({
    zones,
    selectedZoneIds,
    onRemoveZone
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Zonas relacionadas</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    {selectedZoneIds.length > 0 ? (
                        zones
                            .filter(zone => selectedZoneIds.includes(zone.id))
                            .map(zone => (
                                <TableCell key={zone.id} className="flex justify-between items-center gap-1">
                                    {zone.name}
                                    <Button 
                                        type="button"
                                        variant="delete"
                                        size="icon"
                                        onClick={() => onRemoveZone(zone.id)}
                                        className="focus:outline-none"
                                    />
                                </TableCell>
                            ))
                    ) : (
                        <TableCell className="text-center text-neutral6">-- No hay zonas asignadas --</TableCell>
                    )}
                </TableRow>
            </TableBody>
        </Table>
    );
};
