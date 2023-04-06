import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { clickEvent } from 'src/testing';
import { PersonComponent } from './../person/person.component';
import { PeopleComponent } from './people.component';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleComponent, PersonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list app-person components', () => {
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));
    expect(debugElement.length).toEqual(component.people.length);
  });

  it('should raise selected event when clicked', () => {
    clickEvent(fixture, 'app-person .btn-person');
    expect(component.selectedPerson).toEqual(component.people[0]);
  });

  it('should render person when do click', () => {
    clickEvent(fixture, 'app-person .btn-person');
    const liDe = fixture.debugElement.query(By.css('.selectedPerson ul > li'));
    expect(component.selectedPerson).toEqual(component.people[0]);
    expect(liDe.nativeElement.textContent).toContain(
      component.selectedPerson.name
    );
  });
});
