import React, { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Tipos de filtro compatibles
export type FilterType = "checkbox" | "select" | "date" | "input" | "search";

export interface FilterValue {
  id: number | string;
  name: string;
}

export interface FilterItem {
  id: number | string;
  type: FilterType;
  label?: string;
  values?: FilterValue[];
}

export interface InputSearchFilter {
  id: number | string;
  title: string;
  items: FilterItem[];
}

export type FilterComponent = Record<string, boolean | number | string | null | undefined>;

interface SearchWithFiltersProps {
  title?: string;
  inputPlaceholder?: string;
  items: InputSearchFilter[];
  value: string;
  onSearch: (value: string | null) => void;
  filters: FilterComponent;
  onChangeFilters: (filters: FilterComponent) => void;
  stagedFilters?: FilterComponent;
  onChangeStagedFilters?: (filters: FilterComponent) => void;
  showDialogFilters?: boolean;
  setShowDialogFilters?: (show: boolean) => void;
  titleDialogFilters?: string;
  textAddButton?: string;
  textAddButtonMobile?: string;
  onClearFilters?: () => void;
  onApplyFilters?: () => void;
  onRefreshData?: () => void;
  onSelectItem?: (subItemId: string | number, value?: unknown) => void;
  onClickAddBtn?: (type: "desktop" | "mobile") => void;
}


function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const SearchWithFilters: React.FC<SearchWithFiltersProps> = ({
  title,
  inputPlaceholder = "Buscar...",
  items,
  value,
  onSearch,
  filters,
  onChangeFilters,
  stagedFilters,
  onChangeStagedFilters,
  showDialogFilters,
  setShowDialogFilters,
  titleDialogFilters = "Filtros avanzados",
  textAddButton,
  textAddButtonMobile,
  onClearFilters,
  onApplyFilters,
  onRefreshData,
  onSelectItem,
  onClickAddBtn,
}) => {
  // Si el control del modal viene por props, úsalo. Si no, usa estado interno.
  const [internalShowFilters, setInternalShowFilters] = useState(false);
  const showFilters = showDialogFilters !== undefined ? showDialogFilters : internalShowFilters;
  const setShowFilters = setShowDialogFilters !== undefined ? setShowDialogFilters : setInternalShowFilters;

  // stagedFilters controlado desde props o interno
  const [internalStagedFilters, setInternalStagedFilters] = useState<FilterComponent>({});
  const staged = stagedFilters !== undefined ? stagedFilters : internalStagedFilters;
  const setStaged = onChangeStagedFilters !== undefined ? onChangeStagedFilters : setInternalStagedFilters;

  const [inputValue, setInputValue] = useState(value);

  // Debounce búsqueda
  const debouncedValue = useDebounce(inputValue, 300);
  React.useEffect(() => {
    onSearch(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // Chips de filtros activos
  const activeFilterKeys = useMemo(
    () => Object.keys(filters).filter(
      (key) => filters[key] !== null && filters[key] !== undefined && filters[key] !== false
    ),
    [filters]
  );
  const activeFilters = activeFilterKeys.map((key) => {
    const parent = items.find((cat) => cat.items.some((item) => item.id === key));
    const item = parent?.items.find((i) => i.id === key);
    return { key, item, value: filters[key] };
  });

  // Eliminar filtro individual
  const removeFilter = useCallback((key: string) => {
    const parent = items.find((cat) => cat.items.some((item) => item.id === key));
    const item = parent?.items.find((i) => i.id === key);
    if (!item) return;
    const newFilters = { ...filters };
    switch (item.type) {
      case "checkbox":
        newFilters[key] = false;
        break;
      default:
        newFilters[key] = null;
    }
    onChangeFilters(newFilters);
    if (onRefreshData) onRefreshData();
  }, [filters, items, onChangeFilters, onRefreshData]);

  return (
    <div className="w-full">
      {title && <div className="mb-2 font-bold text-lg">{title}</div>}
      <div className="flex items-center gap-2 bg-neutral-100 rounded-lg px-3 py-2">
        <Input
          type="search"
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="flex-1"
        />
        {/* Chips de filtros activos (máx 3) */}
        <div className="flex gap-1 items-center max-w-[220px] overflow-x-auto">
          {activeFilters.slice(0, 3).map(({ key, item, value }) => (
            <span key={key} className="bg-neutral-200 rounded-full px-2 py-1 text-xs flex items-center mr-1">
              {item?.label}
              {item?.type === "select" && value &&
                <>: <b>{item.values?.find(v => v.id === value)?.name ?? value}</b></>
              }
              {item?.type === "input" && value && <>: <b>{value}</b></>}
              {item?.type === "date" && value && <>: <b>{value}</b></>}
              <button
                className="ml-1 text-red-500 hover:text-red-700"
                onClick={() => removeFilter(key)}
                aria-label="Eliminar filtro"
              >×</button>
            </span>
          ))}
          {/* Si hay más de 3, mostrar botón menú */}
          {activeFilters.length > 3 && (
            <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
              +{activeFilters.length - 3} más
            </Button>
          )}
        </div>
        {/* Botón para abrir diálogo de filtros */}
        {items.length > 0 && (
          <Button type="button" variant="outline" onClick={() => setShowFilters(true)}>
            Filtros
          </Button>
        )}
        {/* Botón de acción adicional (desktop) */}
        {textAddButton && onClickAddBtn && (
          <Button className="hidden md:inline-flex ml-2" onClick={() => onClickAddBtn("desktop")}>{textAddButton}</Button>
        )}
        {/* Botón de acción adicional (mobile) */}
        {textAddButtonMobile && onClickAddBtn && (
          <Button className="fixed bottom-4 right-4 md:hidden z-50" onClick={() => onClickAddBtn("mobile")}>{textAddButtonMobile}</Button>
        )}
      </div>
      {/* Modal de filtros avanzados (placeholder, puedes usar un Dialog real) */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowFilters(false)} className="absolute top-2 right-2">✕</button>
            <div className="mb-4 font-semibold text-lg">{titleDialogFilters}</div>
            {/* Aquí iría la UI de filtros avanzados, según items */}
            <div className="mb-4 text-sm text-gray-500">(Aquí se renderizan los controles de filtros avanzados según items)</div>
            <div className="flex justify-between gap-2 mt-4">
              {onClearFilters && (
                <Button variant="outline" onClick={onClearFilters}>Limpiar filtros</Button>
              )}
              {onApplyFilters && (
                <Button variant="default" onClick={() => { onApplyFilters(); setShowFilters(false); }}>Aplicar</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWithFilters;
