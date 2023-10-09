import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(500).keys())].forEach(async (item) => {
    const data = await client.stream.create({
      // @ts-ignore
      data: {
        name: String(item),
        description: String(item),
        price: item,
        user: {
          connect: {
            id: 18,
          },
        },
      },
    });

    console.log(`${item}/500`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => client.$disconnect());
