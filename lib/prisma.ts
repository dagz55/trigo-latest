import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  var prisma: ReturnType<typeof prismaClientWithExtensions> | undefined
}

const prismaClientWithExtensions = () => {
  return new PrismaClient().$extends(withAccelerate())
}

export const prisma = globalThis.prisma || prismaClientWithExtensions()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma 