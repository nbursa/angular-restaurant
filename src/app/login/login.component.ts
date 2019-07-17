import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
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
    error = '';
    loginForm: FormGroup;
    returnUrl: string;
    basic = '';
    credentials = '';
    email = '';
    password = '';

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: LoginService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        // Get input fields values
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        // reset login status
        this.authenticationService.logout();

        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "menu";
    }

    toggle() {
        this._shown = !this._shown;
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        // Abort if invalid form
        if (this.loginForm.invalid) {
            return;
        }
        // Set headers
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8'
        });
        let options = { headers: headers };
        // Send request and subscribe to response
        return this.authenticationService
            .login(
                this.f.username.value,
                this.f.password.value,
                'username',
                'app',
                options
            )
            .pipe(first())
            .subscribe(
                data => {
                    // console.log(data)
                    // console.log(this.route.snapshot.queryParams["returnUrl"]);
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    // console.log(error);
                    this._error = !this._error;
                    if (error.status === 401) {
                        this.error = 'We couldn’t find an account matching the username and password you entered. Please check your username and password and try again.'
                    } else {
                        this.error = error.statusText + " : " + error.message;
                    }
                }
            );
    }
}
