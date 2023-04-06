import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function query<T>(fixture: ComponentFixture<T>, selector: string) {
  return fixture.debugElement.query(By.css(selector));
}
export function queryById<T>(fixture: ComponentFixture<T>, selector: string) {
  return query(fixture, `[testId="${selector}"`);
}

export function queryAll<T>(fixture: ComponentFixture<T>, selector: string) {
  return fixture.debugElement.queryAll(By.css(selector));
}

export function queryAllByDirective<T, D>(
  fixture: ComponentFixture<T>,
  directive: Type<D>
) {
  return fixture.debugElement.queryAll(By.directive(directive));
}
