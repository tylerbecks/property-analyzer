import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'next-auth/jwt';

const secret = process.env.SECRET;

export default async (req: NextApiRequest, res: NextApiResponse): Promise<T> => {
  const token = await jwt.getToken({ req, secret });
  console.log('api/session', { token });
  res.status(200).json({ token });
};
