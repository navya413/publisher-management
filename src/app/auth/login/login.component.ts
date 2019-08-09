import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signupForm: FormGroup;
  loginError;
  rememberMe = false;
  returnURL = '';

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });

    // where to redirect after login?
    this.returnURL = this.route.snapshot.queryParams['returnURL'] || '';

    if (this.authService.isLoggedIn) {
      this.router.navigateByUrl(this.returnURL);
      return;
    }
  }

  login() {
    console.log("In login ...")
    this.loginError = '';
    this.authService.rememberMe = this.rememberMe;
    const { email, password } = this.signupForm.value;
    const auth$ = this.authService.login(email, password);
    auth$.subscribe( (res: any) => {
      console.log(res);
      if (res && res.success) {
        this.authService.setStorage(res.data);
        this.router.navigateByUrl(this.returnURL);
      } else {
        this.loginError = res.error;
      }
    }, (error) => {
      this.loginError = 'Unable to authenticate at the moment. Please try again.';
    });
  }

}
