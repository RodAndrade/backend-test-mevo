import db from "@lib/db";

import { Statement, StatementLog } from "@prisma/client";

import TransactionLogService from "./log";
import { LogResponse, Transaction, StatementUploadResponse } from "./types";
import { ApiResponse } from "../../types/api";

export class StatementService extends TransactionLogService {
  public static async exec(
    fileName: string,
    statement: Transaction[]
  ): Promise<ApiResponse<StatementUploadResponse>> {
    let importedCount = 0;
    const logs: LogResponse[] = [];

    for (const transaction of statement) {
      const _transaction = await this.create(fileName, {
        from: transaction.from,
        to: transaction.to,
        amout: transaction.amout,
      });

      if (_transaction?.data) {
        importedCount++;
        continue;
      }

      logs.push(_transaction.error);
    }

    return {
      data: {
        file: fileName,
        result: {
          count: importedCount,
          error: {
            count: logs.length,
            log: logs,
          },
        },
      },
    };
  }

  private static async create(
    fileName: string,
    { from, to, amout }: Transaction
  ): Promise<ApiResponse<Transaction, LogResponse>> {
    try {
      const isValid = await this.isValid(amout);
      const statementKey = this.createKey(from, to, amout);

      const createdTransaction = await db.statement
        .create({
          data: {
            from,
            to,
            amout,
            flag: !isValid,
            key: statementKey,
          },
          select: {
            id: true,
            from: true,
            to: true,
            amout: true,
            flag: true,
            key: true,
          },
        })
        .catch((err) => {
          throw new Error("Duplicated transaction");
        });

      return { data: createdTransaction };
    } catch (err: any) {
      const log = await this.log({
        file: fileName,
        from,
        to,
        amout,
        error: err?.message ?? "Error",
      });

      return { error: log };
    }
  }

  private static async isValid(amout: bigint) {
    const convertedAmout = this.convertAmout(amout);

    if (convertedAmout < 0) throw new Error("Invalid amout");
    if (convertedAmout > 50000) return false;

    return true;
  }

  private static convertAmout(amout: bigint) {
    return Number(amout) / 100;
  }

  private static createKey(from: bigint, to: bigint, amout: bigint) {
    return `${from}:${to}:${amout}`;
  }
}
