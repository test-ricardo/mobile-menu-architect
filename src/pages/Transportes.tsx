
import React, { useState } from 'react';
import { useTransportes } from '@/hooks/useTransportes';
import { TransportesList } from '@/components/transportes/TransportesList';
import { TransportesPagination } from '@/components/transportes/TransportesPagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import api from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';

const Transportes: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useTransportes(currentPage);

  // Estado para el formulario de transporte
  const [fields, setFields] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null); // null para crear, id para editar

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
        response = await api.put(`/v1/transporte`, { ...fields, id: editId });
      } else {
        // Crear
        response = await api.post(`/v1/transporte`, fields);
      }
      if (response.status === 200) {
        toast({
          title: editId ? 'Transporte actualizado correctamente' : 'Transporte creado correctamente',
          description: editId ? 'Transporte actualizado' : 'Transporte creado',
          variant: 'success',
        });
        setDialogOpen(false);
        setFields({ name: '', phone: '' });
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
  const openCreateDialog = () => {
    setFields({ name: '', phone: '' });
    setEditId(null);
    setDialogOpen(true);
  };

  // Para abrir el dialog en modo editar (ejemplo, puedes conectar esto a la tabla)
  const openEditDialog = (transporte: { id: string; name: string; phone: string }) => {
    setFields({ name: transporte.name, phone: transporte.phone });
    setEditId(transporte.id);
    setDialogOpen(true);
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
              <h2 className="text-primary1 text-[16px] font-semibold mb-4">
                {editId ? 'Editar Transporte' : 'Crear Transporte'}
              </h2>
            </DialogHeader>
            <form
              className="flex flex-col gap-4 md:flex-row"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col flex-1">
                <label className="text-neutral5 text-[14px] mb-2">Nombre</label>
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
                <label className="text-neutral5 text-[14px] mb-2">Teléfono</label>
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={loading}>Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
