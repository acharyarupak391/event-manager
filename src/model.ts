export interface Event {
  userName: string;
  userEmail: string;
  eventName: string;
  eventDescription: string;
  eventStartDate: string;
  eventEndDate: string;
  participants: string[];
  timezone: string;
}

export interface DBEvent {
  id: number;
  user_name: string;
  user_email: string;
  event_name: string;
  event_description: string;
  event_start_date: Date;
  event_end_date: Date;
  participants: string;
  timezone: string;
  created_at: Date;
}