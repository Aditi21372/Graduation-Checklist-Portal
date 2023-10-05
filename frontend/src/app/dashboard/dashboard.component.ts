import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  rollNumber: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Get the rollNumber parameter from the route
    this.route.params.subscribe((params) => {
      this.rollNumber = params["rollNumber"];
    });
  }
}
