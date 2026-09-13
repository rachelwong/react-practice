export interface EmailValidationResponse {
  email: string;
  validations: EmailValidationData;
  score: number;
  status: string;
}

export interface EmailValidationData {
  syntax: boolean;
  domain_exists: boolean;
  mx_records: boolean;
  mailbox_exists: boolean;
  is_disposable: boolean;
  is_role_based: boolean;
}
