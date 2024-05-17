import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import Authentication from '../../../utils/Authentication'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
  }

  const prisma = new PrismaClient()
  const { firstName, lastName, email, password } = req.body
  const hashedPassword: string = await Authentication.passwordHash(
    password
  )

  await prisma.user.create({
    data: {
      name: firstName + ' ' + lastName,
      email,
      password: hashedPassword,
    },
  })

  res.status(200).json({ message: 'User created' })
}
