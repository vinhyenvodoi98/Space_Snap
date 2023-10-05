import Cors from "cors"

const cors = Cors({
  origin: "*",
  methods: ["GET", "HEAD", "POST", "OPTIONS", "PUT"],
})

export default async function corsHandler(req:any, res:any) {
  // Run Cors middleware and handle errors.
  await new Promise((resolve, reject) => {
    cors(req, res, result => {
      if (result instanceof Error) {
        reject(result)
      }

      resolve(result)
    })
  })

  res.json(`Hi from Gatsby Functions`)
}