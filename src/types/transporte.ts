
export interface TransportesIndex {
    status:  boolean;
    message: null;
    data:    TransportesIndexData;
}

interface TransportesIndexData {
    zones: Zone[];
    data:    TransporteData;
}

export interface Zone {
    id: number;
    name: string;
    description: string | null;
}

interface TransporteData {
    current_page:   number;
    data:           Transporte[];
    from:           number;
    last_page:      number;
    links:          Link[];
    per_page:       number;
    to:             number;
    total:          number;
}

export interface Transporte {
    id: number;
    name: string;
    phone: string;
}

export interface Link {
    url:    string | null;
    label:  string;
    active: boolean;
}

export interface TransporteEditResponse {
    status: boolean;
    message: null;
    data: TransporteEditData;
}

interface TransporteEditData {
    zones: Zone[];
    transport: Transporte;
    transport_zones: number[];
}