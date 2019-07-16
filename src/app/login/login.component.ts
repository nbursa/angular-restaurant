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
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // reset login status
        // this.authenticationService.logout();

        // this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "menu";
    }

    toggle() {
        this._shown = !this._shown;
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }
        const scope = "app";
        const provider = "username";

        this.credentials = this.f.username.value + ":" + this.f.password.value;
        this.basic = "Basic " + btoa(this.credentials);

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.basic });
        let options = { headers: headers };

        return this.authenticationService
            .login(
                this.f.username.value,
                this.f.password.value,
                options
            )
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data)
                    console.log(this.route.snapshot.queryParams["returnUrl"]);
                    // this.router.navigate([this.returnUrl]);
                },
                error => {
                    // this._error = !this._error;
                    this.error = JSON.stringify(error.statusText + " : " + error.message);
                    console.log(error);
                }
            );
    }
}
