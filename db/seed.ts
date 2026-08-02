/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";
import { prisma } from "./prisma";
import sampleData from "./sample-data";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const { users, products } = sampleData;

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  const categoryCache = new Map<string, string>();

  for (const product of products) {
    let categoryId = categoryCache.get(product.category);

    if (!categoryId) {
      const slug = slugify(product.category);
      const category = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name: product.category, slug },
      });
      categoryId = category.id;
      categoryCache.set(product.category, categoryId);
    }

    const { category: _category, ...productData } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        categoryId,
      },
    });
  }

  console.log(
    `Seeded ${users.length} users, ${categoryCache.size} categories, ${products.length} products.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
