import { searchIcd11 } from '#services/icd11.js'

export class Icd11Controller {
  static async search(req, res) {
    const results = await searchIcd11(req.validatedQuery.q)
    res.json(results)
  }
}
