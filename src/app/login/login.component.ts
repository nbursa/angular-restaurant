import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [LoginService]
})

export class LoginComponent implements OnInit {

    private _shown = false;
    private _error = false;
    form: FormGroup;
    returnUrl: string;

    constructor(
        private fb: FormBuilder,
        private logger: LoginService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {

        this.form = this.fb.group({
            username: [null, Validators.required],
            password: [null, Validators.required]
          });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'menu';

    }

    toggle() {
        this._shown = !this._shown;
    }

    onSubmit() {

        if (this.form.invalid) {
            return;
        }

        return this.logger.userData(this.form.get('username').value, this.form.get('password').value)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data)
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    console.log(error)
                });

    }

}
