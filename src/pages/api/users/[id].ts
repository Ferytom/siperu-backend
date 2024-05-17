import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
    body,
  } = req

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid id type' })
    return
  }

  try {
    const userById = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })

    if (userById) {
      switch (method) {
        case 'GET':
          res.status(200).json(userById)
          break
        case 'PUT':
          const updatedUser = await prisma.user.update({
            where: {
              id: id,
            },
            data: body,
          })
          res.status(200).json({
            data: updatedUser,
            message: 'User updated successfully',
          })
          break
        case 'DELETE':
          await prisma.user.delete({
            where: {
              id: id,
            },
          })
          res
            .status(200)
            .json({ message: 'User deleted successfully' })
          break
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
          res.status(405).end(`Method ${method} Not Allowed`)
      }
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
