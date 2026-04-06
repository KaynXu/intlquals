export interface RequestSigner {
  sign(params: Record<string, unknown>): Record<string, unknown>;
}

export class NoopSigner implements RequestSigner {
  sign(params: Record<string, unknown>): Record<string, unknown> {
    return params;
  }
}
