import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import { SignUpFormComponent } from './sign-up-form.component';

describe('SignUpFormComponent', () => {
  const createComponent = createComponentFactory({
    component: SignUpFormComponent,
    imports: [ReactiveFormsModule],
  });
  let spectator: Spectator<SignUpFormComponent>;
  let component: SignUpFormComponent;
  let formfields: Element[];

  beforeEach(() => {
    spectator = createComponent({
      props: {
        form: new FormGroup({
          firstname: new FormControl(),
          lastname: new FormControl(),
          email: new FormControl(),
          password: new FormControl(),
        }),
        status: 'pending',
      },
    });
    component = spectator.component;
    formfields = spectator.queryAll('mat-form-field mat-label');
  });

  it('should have all the form fields renderd', () => {
    expect(formfields[0].textContent).toEqual('Firstname');
    expect(formfields[1].textContent).toEqual('Lastname');
    expect(formfields[2].textContent).toEqual('Email');
    expect(formfields[3].textContent).toEqual('Password');
    expect(formfields.length).toEqual(4);
  });

  it('should emit event when submitting', () => {
    component.onSubmit.subscribe((event) => {
      expect(event).toBeTruthy();
    });

    spectator.click(byText('Save'));
  });

  // I wanted to test if all the mat-errors are displayed correctly
  // but I couldnt get that to work with the MatFormFieldHarness
});
