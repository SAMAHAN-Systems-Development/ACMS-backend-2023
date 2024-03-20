export class AddEventDto {
  title: string;
  requires_payment: boolean;
  description: string;
  date: Date;
  eventTiers: eventTier[];
}

class eventTier {
  id: number;
  max_participants: number;
  price: number;
}
