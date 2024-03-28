export class AddEventDto {
  title: string;
  requires_payment: boolean;
  description: string;
  date: Date;
  earlyBirdAccessDate: Date;
  hasEarlyBirdAccess: boolean;
  eventTiers: eventTier[];
}

class eventTier {
  id: number;
  max_participants: number;
  earlyBirdPrice: number;
  originalPrice: number;
}
