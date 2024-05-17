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

  const { email, password } = req.body

  try {
    const prisma = new PrismaClient()
    const userFound: any = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!userFound) {
      return res.status(404).json({ message: 'User not found' })
    }

    const compare = await Authentication.passwordCompare(
      password,
      userFound?.password
    )

    if (compare) {
      const token = Authentication.generateToken(
        userFound?.id,
        userFound?.email,
        userFound?.password
      )

      return res.status(200).json({
        message: 'Login success',
        data: {
          token,
          id: userFound?.id,
          email: userFound?.email,
          firstName: userFound?.firstName,
          lastName: userFound?.lastName,
          learningStyle: userFound?.learningStyle,
        },
      })
    }

    res.status(401).json({ message: 'Invalid credentials' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
