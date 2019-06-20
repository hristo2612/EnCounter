import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterPage } from './counter.page';

describe('Tab1Page', () => {
  let component: CounterPage;
  let fixture: ComponentFixture<CounterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
