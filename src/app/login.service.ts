import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export class LoginService {

  constructor(private http: HttpClient) {}

  userData(username: string, password: string) {
      return this.http.post<any>(`http://main-service.staging.8itapp.com/users/authenticate`, { 'username': username, 'password': password, 'scope': 'app', 'provider': 'username' })
      .pipe(map(user => {
        if (user) {
          console.log(user)
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
    }));
  }
}
