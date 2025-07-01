import React from 'react';
import { Zone } from '@/types/transporte';
import { Button } from '@/components/ui/button';

interface ZoneSelectorProps {
    zones: Zone[];
    selectedZoneIds: number[];
    onOpenZoneDialog: () => void;
    onAddZone: (zoneId: number) => void;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
    onOpenZoneDialog,
}) => {

    return (
        <div className="flex justify-end">
          
            <Button 
                type="button" 
                variant="default" 
                onClick={onOpenZoneDialog}
                className="whitespace-nowrap"
            >
                Relacionar Zonas
            </Button>
        </div>
    );
};
