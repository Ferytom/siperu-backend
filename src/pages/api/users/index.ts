import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const prisma = new PrismaClient()
    const allUsers = await prisma.user.findMany()
    res.status(200).json(allUsers)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
