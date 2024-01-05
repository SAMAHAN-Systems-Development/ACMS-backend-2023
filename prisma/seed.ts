import { PrismaService } from '../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

const prisma = new PrismaService();

const students = 30;
const events = 10;

async function main() {
  const course = ['BSCS', 'BSIT', 'BSDS'];
  const statuses = ['accepted', 'declined', 'pending'];

  const eventsList = [];
  for (let i = 0; i < events; i++) {
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

  for (let i = 0; i < students; i++) {
    const year_and_course =
      faker.helpers.arrayElement(course) +
      ' ' +
      faker.string.fromCharacters('1234') +
      '-' +
      faker.string.fromCharacters('ABC');

    // https://github.com/prisma/prisma/issues/5455
    await prisma.student.create({
      data: {
        uuid: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        year_and_course: year_and_course,
        payment: {
          create: {
            photo_src: 'link/to/payment/receipt.jpg',
            status: faker.helpers.arrayElement(statuses),
          },
        },
        event: {
          connect: { id: Math.ceil(Math.random() * events) },
        },
      },
    });
  }
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
