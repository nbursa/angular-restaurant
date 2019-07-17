import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string, provider: string, scope: string, options: object) {
    // login(username: string, password: string) {
        // const formData: 
        //     { 
        //         username: 'username',
        //         password: 'password',
        //         provider: 'username' 
        //     } };

        return this.http.post<any>("http://main-service.staging.8itapp.com/users/authenticate", { username: username, password: password, provider: provider, scope: scope }, options)
            .pipe(
                map(user => {
                    if (user) {
                        console.log(user);
                        // user.authdata = window.btoa(username + ':' + password);
                        localStorage.setItem("currentUser", JSON.stringify(user));
                    }
                    return user;
                })
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
