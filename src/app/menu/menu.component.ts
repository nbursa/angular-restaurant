import { Component, OnInit } from "@angular/core";
import { MenuService } from "../menu.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  providers: [MenuService]
})
export class MenuComponent implements OnInit {
  token: string;
  dishes: [];
  name: string;
  urlString: string;
  loading: boolean;

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    this.token = JSON.stringify(user.authorization.token);

    this.filterDishes(this.name);
  }

  formatDate(date) {
    date = date.split("T")[0].split("-");
    let month = date[1].replace(/^0+/, "");
    let day = date[2];
    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let monthIndex = month;
    function ordinal_suffix_of(i) {
      var j = i % 10,
        k = i % 100;
      if (j == 1 && k != 11) {
        return i + "st";
      }
      if (j == 2 && k != 12) {
        return i + "nd";
      }
      if (j == 3 && k != 13) {
        return i + "rd";
      }
      return i + "th";
    }
    let newDate = monthNames[monthIndex] + " " + ordinal_suffix_of(day);
    return newDate;
  }

  onSearchChange(value) {
    this.name = value;
    this.filterDishes(this.name);
  }

  filterDishes(name: string) {
    if (name == undefined) {
      this.urlString =
        "http://main-service.staging.8itapp.com/dishes?lat=40.756608&lng=-73.983329&radius=1";
    } else {
      this.urlString = `http://main-service.staging.8itapp.com/dishes?lat=40.756608&lng=-73.983329&radius=1&name=${name}`;
    }
    this.loading = true;
    this.menuService.getMenu(this.urlString, this.token).subscribe(
      dishes => {
        this.dishes = dishes;
        this.loading = false;
        return this.dishes;
      },
      error => {
        console.log(error.message);
      }
    );
  }

  logOut() {
    this.router.navigate([""]);
  }
}
