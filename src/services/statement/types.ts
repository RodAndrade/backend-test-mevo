import { Statement, StatementLog } from "@prisma/client";

export type Transaction = Omit<Statement, "id" | "flag" | "key">;
export type Log = Omit<StatementLog, "id">;
export type LogResponse = Pick<StatementLog, "id" | "error">;

interface StatementUploadResponseError {
  count: number;
  log: LogResponse[];
}

export interface StatementUploadResponse {
  file: string;
  result: {
    count: number;
    error: StatementUploadResponseError;
  };
}
