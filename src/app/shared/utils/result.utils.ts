import { Result } from '@shared/models/result.model';

export function isResult<T>(value: unknown): value is Result<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'isSuccess' in value
  );
}

export function extractResultData<T>(
  res: unknown,
  fallback: () => void = () => { }
): T | null {
  if (isResult<T>(res)) {
    if (res.isSuccess && res.data !== undefined) {
      return res.data;
    } else {
      fallback(); 
    }
  } else {
    fallback();
  }
  return null;
}
