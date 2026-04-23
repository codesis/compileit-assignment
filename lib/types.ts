export type Booking = {
  id: number;
  roomId: string;
  date: string;
  startHour: number;
  endHour: number;
  title: string;
  organizer: string;
};

export type BookingFormData = {
  roomId: string;
  date: string;
  startTime: number;
  duration: number;
};

export type ViewType = 'calendar' | 'form';

export type StatusType = 'idle' | 'saving' | 'deleting';

export const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 timme' },
  { value: 90, label: '1h 30min' },
  { value: 120, label: '2 timmar' },
  { value: 150, label: '2h 30min' },
  { value: 180, label: '3 timmar' },
  { value: 210, label: '3h 30min' },
  { value: 240, label: '4 timmar' },
  { value: 270, label: '4h 30min' },
  { value: 300, label: '5 timmar' },
  { value: 330, label: '5h 30min' },
  { value: 360, label: '6 timmar' },
  { value: 390, label: '6h 30min' },
  { value: 420, label: '7 timmar' },
  { value: 450, label: '7h 30min' },
  { value: 480, label: '8 timmar' },
  { value: 510, label: '8h 30min' },
  { value: 540, label: '9 timmar' },
] as const;
