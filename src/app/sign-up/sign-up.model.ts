import { FormControl } from '@angular/forms';

export interface SignUpForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

export type Status = 'pending' | 'loading' | 'success' | 'error';
