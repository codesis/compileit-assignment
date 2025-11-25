export type Booking = {
  id: number;
  roomId: string;
  date: string;
  startHour: number;
  endHour: number;
  title: string;
  organizer: string;
};

export type StatusType = 'idle' | 'saving';
