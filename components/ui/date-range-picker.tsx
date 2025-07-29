import * as React from 'react';
import { Calendar } from './calendar';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { Button } from './button';
import { format, isValid, parseISO, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { X } from 'lucide-react';

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

const QUICK_RANGES = [
  { label: '7D', value: 'last7' },
  { label: '30D', value: 'last30' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'Last Year', value: 'lastYear' },
  { label: 'All Time', value: 'all' },
  { label: 'Custom', value: 'custom' },
];

function getQuickRange(value: string): DateRange {
  const today = new Date();
  switch (value) {
    case 'last7':
      return { from: subDays(today, 6), to: today };
    case 'last30':
      return { from: subDays(today, 29), to: today };
    case 'thisMonth':
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case 'thisYear':
      return { from: new Date(today.getFullYear(), 0, 1), to: new Date(today.getFullYear(), 11, 31) };
    case 'lastYear':
      return { from: new Date(today.getFullYear() - 1, 0, 1), to: new Date(today.getFullYear() - 1, 11, 31) };
    case 'all':
      return { from: null, to: null };
    default:
      return { from: null, to: null };
  }
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [quick, setQuick] = React.useState('last7');

  React.useEffect(() => {
    if (quick !== 'custom') {
      onChange(getQuickRange(quick));
    }
  }, [quick]);

  const display = value.from && value.to
    ? `${format(value.from, 'MMM d, yyyy')} - ${format(value.to, 'MMM d, yyyy')}`
    : 'All Time';

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        <ToggleGroup type="single" value={quick} onValueChange={v => v && setQuick(v)} className="flex-wrap">
          {QUICK_RANGES.map(r => (
            <ToggleGroupItem key={r.value} value={r.value} aria-label={r.label}>
              {r.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[200px] justify-start w-full sm:w-auto" aria-label="Select date range">
                {display}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{
                  from: value.from || undefined,
                  to: value.to || undefined
                }}
                onSelect={range => {
                  onChange({
                    from: range?.from || null,
                    to: range?.to || null
                  });
                  setQuick('custom');
                }}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {(value.from || value.to) && (
            <Button variant="ghost" size="icon" onClick={() => { setQuick('all'); onChange({ from: null, to: null }); }} aria-label="Clear date range">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 