import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type ApiErrorBody = {
  message?: string;
  code?: string;
  errors?: Record<string, string[] | string>;
};

export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function getApiErrorData(error: unknown): ApiErrorBody | null {
  if (!isFetchBaseQueryError(error)) {
    return null;
  }

  if (typeof error.data === 'object' && error.data !== null) {
    return error.data as ApiErrorBody;
  }

  return null;
}

export function getApiErrorCode(error: unknown) {
  return getApiErrorData(error)?.code;
}

export function getApiErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    const data = getApiErrorData(error);
    if (data?.message) {
      return data.message;
    }

    if (error.status === 401) {
      return 'Требуется авторизация';
    }

    if (error.status === 403) {
      return 'Нет доступа';
    }

    if (error.status === 404) {
      return 'Не найдено';
    }

    if (error.status === 'FETCH_ERROR') {
      return 'Ошибка сети';
    }

    return 'Произошла ошибка';
  }

  const serialized = error as SerializedError;
  return serialized?.message || 'Произошла ошибка';
}
