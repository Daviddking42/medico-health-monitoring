const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "mysql://root:qBEhvMlNfOWUCSduxANCzxdFouhWUVtL@switchyard.proxy.rlwy.net:40591/railway",
    },
  },
});
module.exports = prisma;
