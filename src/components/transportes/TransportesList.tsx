
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

interface TransportesListProps {
  transportes: Transporte[];
}

export const TransportesList: React.FC<TransportesListProps> = ({ transportes }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transportes.map((transporte) => (
            <TableRow key={transporte.id}>
              <TableCell className="font-medium">{transporte.id}</TableCell>
              <TableCell>{transporte.name}</TableCell>
              <TableCell>{transporte.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
