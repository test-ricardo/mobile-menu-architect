
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
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
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