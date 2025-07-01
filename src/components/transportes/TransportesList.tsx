
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
}

export const TransportesList: React.FC<TransportesListProps> = ({ transportes, onRowClick }) => {
    return (
        <div className="rounded-lg shadow-sm border">
            <Table>
                <TableHeader className='bg-neutral4 px-[15px] py-[5px]'>
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
                                <span>
                                    #{transporte.id}
                                    <span className="text-neutral6 me-[6px]">
                                        {transporte.name}
                                    </span>
                                </span>
                                <Button variant="edit" onClick={() => onRowClick(transporte)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
