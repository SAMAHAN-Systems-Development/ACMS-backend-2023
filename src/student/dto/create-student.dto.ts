export class CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  year_and_course: string;
  eventId: number | null;
  photo_src: string;
  isSubmittedByStudent: boolean;
  event_requires_payment: boolean;
}
