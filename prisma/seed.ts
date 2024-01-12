import { PrismaService } from '../src/prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { faker } from '@faker-js/faker';

const prisma = new PrismaService();
const supabase = new SupabaseService();

async function seedEvents(n_events) {
  const eventsList = [];
  for (let i = 0; i < n_events; i++) {
    eventsList.push({
      title: faker.lorem.words({ min: 3, max: 6 }),
      price: faker.commerce.price({ min: 50, max: 150, symbol: 'Php' }),
      requires_payment: faker.datatype.boolean(),
      max_participants: faker.number.int({ min: 20, max: 200 }),
      description: faker.lorem.text(),
      date: faker.date.soon({ days: 90, refDate: new Date() }),
      is_active: faker.datatype.boolean(),
      form_name: faker.lorem.words({ min: 2, max: 6 }),
    });
  }
  await prisma.event.createMany({ data: eventsList });
}

async function seedPayments(n_students) {
  const statuses = ['accepted', 'declined', 'pending'];
  const paymentList = [];
  for (let i = 0; i < n_students; i++) {
    paymentList.push({
      photo_src: '/placeholderImage.jpg',
      status: faker.helpers.arrayElement(statuses),
    });
  }
  await prisma.payment.createMany({ data: paymentList });
}

async function seedStudents(n_students, n_events) {
  const course = ['BSCS', 'BSIT', 'BSDS'];
  const studentList = [];

  for (let i = 0; i < n_students; i++) {
    const year_and_course =
      faker.helpers.arrayElement(course) +
      ' ' +
      faker.string.fromCharacters('1234') +
      '-' +
      faker.string.fromCharacters('ABC');

    // https://github.com/prisma/prisma/issues/5455

    const paymentId = i + 1;
    const eventId = Math.ceil(Math.random() * n_events);
    studentList.push({
      uuid: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      year_and_course: year_and_course,
      paymentId: paymentId,
      eventId: eventId,
    });
  }

  await prisma.student.createMany({ data: studentList });
}

async function seedUsers() {
  const users = [
    {
      email: 'facilitator@addu.edu.ph',
      password: 'secretpassword',
      userType: 'facilitator',
    },
    {
      email: 'cashier@addu.edu.ph',
      password: 'secretpassword',
      userType: 'cashier',
    },
    {
      email: 'admin@addu.edu.ph',
      password: 'secretpassword',
      userType: 'admin',
    },
  ];

  const userList = [];

  for (const userData of users) {
    const { user, error } = await supabase.createSupabaseUser(
      userData.email,
      userData.password,
    );

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }

    userList.push({
      email: userData.email,
      userType: userData.userType,
      supabaseId: user.id,
    });
  }

  await prisma.user.createMany({ data: userList });
}

async function main() {
  const events = 10;
  const students = 30;

  await seedEvents(events);
  await seedPayments(students);
  await seedStudents(students, events);
  await seedUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
