import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class V2Service {

  constructor(private router : Router) { }

  changeView(agencyId,selectedView){
      console.log(":::::",selectedView)
      this.router.navigate(["v2","agency",agencyId,selectedView.toLowerCase()])   
  }

}
