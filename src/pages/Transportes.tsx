
import React, { useState } from 'react';
import { useTransportes } from '@/hooks/useTransportes';
import { TransportesList } from '@/components/transportes/TransportesList';
import { TransportesPagination } from '@/components/transportes/TransportesPagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Transportes: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useTransportes(currentPage);

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
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Transporte</span>
        </Button>
      </div>

      {transportes.length > 0 ? (
        <>
          <TransportesList transportes={transportes} />
          
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
