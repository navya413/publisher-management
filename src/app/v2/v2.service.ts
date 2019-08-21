import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class V2Service {
  timezones: any[];
  
  constructor(private router : Router,private http:HttpClient) { 
    this.getTimeZones().subscribe(res => {
      this.timezones = res;
    });
  }

  // pageType - agency
  changeView(agencyId,pageType,selectedView){
      console.log(":::::",selectedView)
      this.router.navigate(["v2",pageType,agencyId,selectedView.toLowerCase()])   
  }

  


  getTimeZones() {
    return this.http.get<any>('./assets/mock-data/timezone-data.json');
  }

}
