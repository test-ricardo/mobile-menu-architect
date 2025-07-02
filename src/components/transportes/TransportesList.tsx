
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Transporte } from '@/types/transporte';
import { Button } from '../ui/button';

interface TransportesListProps {
    transportes: Transporte[];
    onRowClick?: (transporte: Transporte) => void;
    handleDelete?: (id: string) => void;
}

export const TransportesList: React.FC<TransportesListProps> = ({ transportes, onRowClick, handleDelete }) => {
    return (
        <div className="flex-1 rounded-lg shadow-sm border">
            <Table>
                <TableHeader className='sticky top-0 z-10 bg-neutral4 px-[15px] py-[5px]'>
                    <TableRow>
                        <TableHead>Transportes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transportes.map((transporte) => (
                        <TableRow
                            key={transporte.id}
                            className={onRowClick ? 'cursor-pointer hover:bg-gray-100' : ''}
                            onClick={onRowClick ? () => onRowClick(transporte) : undefined}
                        >
                            <TableCell className="flex justify-between items-center text-neutral5 italic text-[12px]">
                                <span className="flex gap-1">
                                    #{transporte.id}
                                    <span className="text-neutral6 me-[6px]">
                                        {transporte.name}
                                    </span>
                                </span>

                                <span className="flex gap-2">
                                    <Button variant="edit" size="icon" onClick={() => onRowClick(transporte)} />
                                    <Button 
                                        variant="delete" 
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Detener la propagación del evento
                                            handleDelete(transporte.id.toString());
                                        }} 
                                    />
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
