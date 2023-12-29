export class CreateStudentDto {
  id?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  year_and_course: string;
  paymentId: number;
  eventId: number;
}
