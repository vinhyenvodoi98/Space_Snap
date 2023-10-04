import { apiSpaceConvertCall } from "../utils/space";

export default async function handler(req:any, res:any) {
  const { chain, domain } = req.query;
  const {address} = await apiSpaceConvertCall({url:`getAddress?tld=${chain}&domain=${domain}`})
  res.status(200).json(
    { address },
  )
}
