import db from "../../lib/db";

import { LogResponse, Log } from "./types";

export default class StatementLogService {
  static async log(log: Log): Promise<LogResponse> {
    return await db.statementLog.create({
      data: log,
      select: {
        id: true,
        error: true,
      },
    });
  }
}
