import type { ApiError } from "../../types/domain";

export class ApiClientError extends Error implements ApiError {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}
export const delay = (ms = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));
