import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(20).keys())].forEach(async (item) => {
    const data = await client.product.create({
      data: {
        image: '',
        place: String(`테스트상품_${item}_아무데서나`),
        name: String(`테스트상품_${item}`),
        description: String(`테스트상품_${item}_우와 이게 되네`),
        price: item,
        user: {
          connect: {
            id: 1,
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
