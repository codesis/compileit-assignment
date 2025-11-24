export type Booking = {
  id: number;
  roomId: string;
  date: string;
  startHour: number;
  endHour: number;
  title: string;
  organizer: string;
};

export type SlotSelection = {
  roomId: string;
  date: string;
  hour: number;
};

export type ViewType = 'table' | 'form';

export type StatusType = 'idle' | 'saving';
