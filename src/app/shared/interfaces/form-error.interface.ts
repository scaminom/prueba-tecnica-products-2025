export interface FormErrorMapper {
  [key: string]: (error: unknown & { requiredLength?: number }, fieldLabel: string) => string;
}
