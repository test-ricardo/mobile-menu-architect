import React from 'react';
import { Zone } from '@/types/transporte';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZoneSelectorProps {
    zones: Zone[];
    selectedZoneIds: number[];
    onOpenZoneDialog: () => void;
    onAddZone: (zoneId: number) => void;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
    zones,
    selectedZoneIds,
    onOpenZoneDialog,
    onAddZone
}) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    const availableZones = zones.filter(zone => !selectedZoneIds.includes(zone.id));

    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? zones.find(zone => zone.id === parseInt(value))?.name
                            : "Seleccionar zona..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar zona..." />
                        <CommandEmpty>No se encontró ninguna zona.</CommandEmpty>
                        <CommandGroup>
                            {availableZones.map(zone => (
                                <CommandItem
                                    key={zone.id}
                                    value={String(zone.id)}
                                    onSelect={(currentValue) => {
                                        const zoneId = parseInt(currentValue);
                                        onAddZone(zoneId);
                                        setValue("");
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === String(zone.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {zone.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <Button 
                type="button" 
                variant="secondary" 
                onClick={onOpenZoneDialog}
                className="whitespace-nowrap"
            >
                Ver todas las zonas
            </Button>
        </div>
    );
};
