import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LoginService {
  constructor(private http: HttpClient) {}

  login(
    username: string,
    password: string,
    provider: string,
    scope: string,
    options: object
  ) {
    return this.http
      .post<any>(
        "http://main-service.staging.8itapp.com/users/authenticate",
        {
          username: username,
          password: password,
          provider: provider,
          scope: scope
        },
        options
      )
      .pipe(
        map(user => {
          if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem("currentUser");
  }
}
