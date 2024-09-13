import { randomUUID } from "node:crypto";

import { Request, Response } from "express";
import { StatementService } from "@services/statement";
import { Transaction } from "@services/statement/types";

export class StatementController {
  static async upload(req: Request, res: Response) {
    const statement = (req.body?.statement as Transaction[]) || [];
    if (!statement)
      return res.status(404).json({
        error: "File not found",
      });

    const fileName = randomUUID();
    const uploadResponse = await StatementService.exec(fileName, statement);

    return res.status(200).json(uploadResponse);
  }
}
