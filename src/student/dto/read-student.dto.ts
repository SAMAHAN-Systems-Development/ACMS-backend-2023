export class ReadStudentDto {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  year_and_course: string;
  event: {
    createdAt: Date;
    updatedAt: Date;
    title: string;
    price: number;
    requires_payment: boolean;
    max_participants: number;
    description: string;
    date: Date;
    is_active: boolean;
    form_name: string;
  };
  payment: {
    createdAt: Date;
    updatedAt: Date;
    photo_src: string;
    status: string;
  };
}
