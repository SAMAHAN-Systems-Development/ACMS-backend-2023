export class AddEventDto {
  title: string;
  requires_payment: boolean;
  price: number;
  max_participants: number;
  description: string;
  date: Date;
}
