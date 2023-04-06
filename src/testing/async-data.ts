import { defer, of } from 'rxjs';

export function observableSuccess<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function observableError() {
  return defer(() => Promise.reject());
}

export function promiseSuccess<T>(data: T) {
  return Promise.resolve(data);
}

export function promiseError() {
  return Promise.reject();
}

export function mockObservable<T>(data: T) {
  return of(data);
}
export function mockPromise<T>(data: T) {
  return Promise.resolve(data);
}
