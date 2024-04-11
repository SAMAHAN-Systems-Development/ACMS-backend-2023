import { PrismaService } from '../src/prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { faker } from '@faker-js/faker';

const prisma = new PrismaService();
const supabase = new SupabaseService();

async function seedEventTiers() {
  const tiers = ['MADAYAW TIER', 'VVIP', 'Gold', 'Silver', 'Bronze', 'Gen Ad'];

  const tierList = [];
  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    tierList.push({
      name: tier,
    });
  }
  await prisma.eventTier.createMany({ data: tierList });
}

async function seedEvents(n_events, n_tiers) {
  const eventsList = [];
  for (let i = 0; i < n_events; i++) {
    const title = faker.lorem.words({ min: 3, max: 6 });
    const formName = title.toLowerCase().split(' ').join('-');
    const event = {
      title: title,
      requires_payment: faker.datatype.boolean(),
      description: faker.lorem.text(),
      date: faker.date.soon({ days: 90, refDate: new Date() }),
      is_active: faker.datatype.boolean(),
      form_name: formName,
      hasEarlyBirdAccess: true,
      earlyBirdAccessDate: faker.date.soon({ days: 5, refDate: new Date() }),
    };

    eventsList.push(event);
  }
  await prisma.event.createMany({ data: eventsList });

  for (let i = 0; i < n_events; i++) {
    for (let j = 0; j < n_tiers; j++) {
      await prisma.eventTierOnEvent.create({
        data: {
          eventId: i + 1,
          eventTierId: j + 1,
          earlyBirdPrice: faker.number.int({ min: 100, max: 200 }),
          originalPrice: faker.number.int({ min: 200, max: 300 }),
          max_participants: faker.number.int({ min: 20, max: 200 }),
          is_active: true,
        },
      });
    }
  }
}

async function seedPayments(n_students) {
  const statuses = ['accepted', 'declined', 'pending'];
  const paymentList = [];
  for (let i = 0; i < n_students; i++) {
    paymentList.push({
      photo_src: '/placeholderImage.jpg',
      status: faker.helpers.arrayElement(statuses),
      required_payment: faker.number.int({ min: 100, max: 300 }),
      reference_number: faker.string.alphanumeric({
        length: { min: 10, max: 10 },
      }),
    });
  }
  await prisma.payment.createMany({ data: paymentList });
}

async function seedStudents(n_students, n_events, n_tiers) {
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
    const eventTierOnEventId = faker.number.int({
      min: 1,
      max: n_events * n_tiers,
    });
    studentList.push({
      uuid: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      year_and_course: year_and_course,
      paymentId: paymentId,
      eventTierOnEventId: eventTierOnEventId,
      is_addu_student: faker.datatype.boolean(),
      id_src: '/sampleId.png',
    });
  }

  await prisma.student.createMany({ data: studentList });
}

async function seedUsers() {
  const users = [
    {
      email: 'viverbungag@gmail.com',
      password: 'secretPassword',
      userType: 'admin',
    },
    {
      email: 'viverbungag2@gmail.com',
      password: 'secretPassword',
      userType: 'facilitator',
    },
    {
      email: 'viverbungag3@gmail.com',
      password: 'secretPassword',
      userType: 'cashier',
    },
  ];

  const userList = [];

  // let idx = 0;
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
      supabaseUserId: user.id,
    });
    // idx++;
  }

  await prisma.user.createMany({ data: userList });
}

async function main() {
  const events = 10;
  const students = 80;
  const tiers = 6;

  await seedEventTiers();
  await seedEvents(events, tiers);
  await seedPayments(students);
  await seedStudents(students, events, tiers);
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
