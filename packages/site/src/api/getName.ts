import { apiSpaceConvertCall } from '../utils/space';

export default async function handler(req: any, res: any) {
  const { chain, address } = req.query;
  const { name } = await apiSpaceConvertCall({
    url: `getName?tld=${chain}&address=${address}`,
  });
  res.status(200).json({ name });
}
