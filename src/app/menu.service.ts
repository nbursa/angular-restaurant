import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";

export class MenuService {
  constructor(private http: HttpClient) {}

  getMenu(urlString: string, token: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: "Bearer " + JSON.parse(token)
      })
    };
    return this.http.get<any>(urlString, options).pipe(
      map(dish => {
        if (dish) {
          return dish;
        }
      })
    );
  }
}
