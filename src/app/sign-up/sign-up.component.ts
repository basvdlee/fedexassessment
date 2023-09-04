import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { filter, mergeMap, tap } from 'rxjs';
import { SignUpService } from './data-access/sign-up.service';
import { SignUpForm } from './sign-up.model';
import { SignUpFormComponent } from './ui/sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SignUpFormComponent,
    HttpClientModule,
  ],
  providers: [SignUpService],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  private formBuilder = inject(NonNullableFormBuilder);

  protected submitted = signal<Event | null>(null);
  protected signUpService = inject(SignUpService);
  protected form = this.formBuilder.group<SignUpForm>({
    firstname: this.formBuilder.control('', [Validators.required]),
    lastname: this.formBuilder.control('', [Validators.required]),

    // Ofcourse we can write our own regex to validate the email
    // The only true email validation is by the user confirming Its email.
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.formBuilder.control('', [
      Validators.required,
      // at least one lower and upper case and between 8/64 characters
      Validators.pattern(/(?=.*[a-z])(?=.*[A-Z]).{8,64}/g),

      this.validatePasswordAgainstControl('firstname'),
      this.validatePasswordAgainstControl('lastname'),
    ]),
  });

  constructor() {
    toObservable(this.submitted)
      .pipe(
        takeUntilDestroyed(),
        filter(() => this.form.valid),
        tap(() => this.form.disable()),
        mergeMap(() => this.signUpService.register(this.form.value)),
        tap({ error: () => this.form.enable() })
      )
      .subscribe();
  }

  private validatePasswordAgainstControl(controlName: string): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const invalidControlValue: string | undefined =
        control.parent?.get(controlName)?.value;

      if (!invalidControlValue) {
        return null;
      }

      const invalidValues = invalidControlValue.toLocaleLowerCase().split(' ');

      return invalidValues.some((invalidMatch) =>
        control.value.toLocaleLowerCase().includes(invalidMatch)
      )
        ? { [`${controlName}Used`]: true }
        : null;
    };
  }
}
