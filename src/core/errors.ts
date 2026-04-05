export class AppError extends Error {
  constructor(message: string, readonly code = "APP_ERROR") {
    super(message);
    this.name = "AppError";
  }
}

export class ProviderError extends AppError {
  constructor(message: string, readonly provider: string) {
    super(message, "PROVIDER_ERROR");
    this.name = "ProviderError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}
