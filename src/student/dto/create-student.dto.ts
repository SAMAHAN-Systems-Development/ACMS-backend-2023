export class CreateStudentDto {
  createdAt?: Date | string;
  updatedAt?: Date | string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  year_and_course: string;
  paymentId: number | null;
  eventId: number | null;
}
