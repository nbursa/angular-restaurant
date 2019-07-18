import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { LoginService } from "../login.service";
import { first } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  _shown = false;
  _error = false;
  error = "";
  loginForm: FormGroup;
  returnUrl: string;
  basic = "";
  credentials = "";
  email = "";
  password = "";

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.authenticationService.logout();

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "menu";
  }

  toggle() {
    this._shown = !this._shown;
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8"
    });
    let options = { headers: headers };
    return this.authenticationService
      .login(
        this.f.username.value,
        this.f.password.value,
        "username",
        "app",
        options
      )
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          this._error = !this._error;
          if (error.status === 401) {
            this.error =
              "We couldn’t find an account matching the username and password you entered. Please check your username and password and try again.";
          } else {
            this.error = error.statusText + " : " + error.message;
          }
        }
      );
  }
}
