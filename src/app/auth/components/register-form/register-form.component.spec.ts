import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { generateOneUser } from 'src/app/models/user.mock';
import { UsersService } from 'src/app/services/user.service';
import { getText, mockObservable, observableSuccess } from 'src/testing';
import { setInputValue } from 'src/testing/forms';
import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService', ['create']);

    await TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: UsersService, useValue: spy }],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the emailField be invalid', () => {
    component.emailField?.setValue('esto no es un correo');
    expect(component.emailField?.invalid)
      .withContext('wrong email')
      .toBeTruthy();

    component.emailField?.setValue('');
    expect(component.emailField?.invalid).withContext('empty').toBeTruthy();
  });

  it('should the emailField be invalid from ui', () => {
    setInputValue(fixture, 'input#email', 'esto no es un correo');
    const emailFieldEmail = getText(fixture, 'emailFieldEmail');

    expect(component.emailField?.invalid)
      .withContext('wrong email')
      .toBeTruthy();

    // component.emailField?.setValue('');
    // expect(component.emailField?.invalid).withContext('empty').toBeTruthy();
    expect(emailFieldEmail).toBe(`*It's not a email`);
  });

  it('should the passwordField be invalid', () => {
    component.passwordField?.setValue('');
    expect(component.passwordField?.invalid).withContext('empty').toBeTruthy();

    component.passwordField?.setValue('12345');
    expect(component.passwordField?.invalid).withContext('12345').toBeTruthy();

    component.passwordField?.setValue('asasaasasdsdsd');
    expect(component.passwordField?.invalid)
      .withContext('without number')
      .toBeTruthy();

    component.passwordField?.setValue('asas1aasasdsdsd');
    expect(component.passwordField?.valid).withContext('rigth').toBeTruthy();
  });

  it('should the form be invalid', () => {
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@gmil.com',
      password: '12121212',
      confirPassword: '12121212',
      checkTerms: false,
    });
    expect(component.form.invalid).toBeTruthy();
  });

  it('should send the form successfully', () => {
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@gmil.com',
      password: '12121212',
      confirmPassword: '12121212',
      checkTerms: true,
    });
    const mockUser = generateOneUser();
    usersServiceSpy.create.and.returnValue(mockObservable(mockUser));
    // Act
    component.register(new Event('submit'));
    expect(component.form.valid).toBeTruthy();
    expect(usersServiceSpy.create).toHaveBeenCalled();
  });

  it('should send the form successfully and "loading" => "success"', fakeAsync(() => {
    component.form.patchValue({
      name: 'Nico',
      email: 'nico@gmil.com',
      password: '12121212',
      confirmPassword: '12121212',
      checkTerms: true,
    });
    const mockUser = generateOneUser();
    usersServiceSpy.create.and.returnValue(observableSuccess(mockUser));
    // Act
    component.register(new Event('submit'));
    fixture.detectChanges();
    expect(component.status).toEqual('loading');
    tick(); // exec pending tasks
    fixture.detectChanges();
    expect(component.status).toEqual('success');
    expect(component.form.valid).toBeTruthy();
    expect(usersServiceSpy.create).toHaveBeenCalled();
  }));
});
