export class CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  year_and_course: string;
  eventId: number | null;
  photo_src: string;
  isSubmittedByStudent: boolean;
  event_requires_payment: boolean;
  eventTierId: number | null;
  is_addu_student: boolean;
  required_payment: number;
  id_src: string;
  payment_reference_number: string;
}
