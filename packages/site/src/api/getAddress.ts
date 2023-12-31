import { apiSpaceConvertCall } from '../utils/space';
import Cors from "cors"

const cors = Cors({
  origin: "*",
  methods: ["GET", "HEAD", "POST", "OPTIONS", "PUT"],
})


const runCorsMiddleware = (req:any, res:any) => {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req: any, res: any) {
  const { chain, domain } = req.query;
  try {
    await runCorsMiddleware(req, res);

    const { address } = await apiSpaceConvertCall({
      url: `getAddress?tld=${chain}&domain=${domain}`,
    });
    res.status(200).json({ address });
  } catch (error) {
    res.status(403).json({ response: 'Not in origin' });
  }
}
