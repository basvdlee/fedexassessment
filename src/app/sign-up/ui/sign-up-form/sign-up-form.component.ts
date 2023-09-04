import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { SignUpForm, Status } from '../../sign-up.model';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  providers: [MatFormFieldHarness],
  templateUrl: './sign-up-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpFormComponent {
  @Input({ required: true }) form!: FormGroup<SignUpForm>;
  @Input({ required: true }) status!: Status;
  @Output() onSubmit = new EventEmitter<Event>();
}
