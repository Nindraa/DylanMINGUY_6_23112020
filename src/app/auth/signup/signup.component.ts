import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  loading: boolean;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onSignup() {
    this.loading = true;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (regexPassword.test(password) == false) {
      alert('Votre mot de passe doit contenir 8 caractères minimum, 1 lettre majuscule, 1 lettre minuscule et 1 nombre.')
      this.loading = false;
    } else {
      this.auth.createUser(email, password).then(
        (response: { message: string }) => {
          console.log(response.message);
          this.auth.loginUser(email, password).then(
            () => {
              this.loading = false;
              this.router.navigate(['/sauces']);
            }
          ).catch(
            (error) => {
              this.loading = false;
              console.error(error);
              this.errorMsg = error.message;
            }
          );
        }
      ).catch((error) => {
          this.loading = false;
          console.error(error);
          this.errorMsg = error.message;
      });
    }
  }
}
