import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PubFeedsComponent } from './pub-feeds.component';
import { PubFeedsRoutingModule } from './pub-feeds-routing.module';
import { RouterModule } from '@angular/router';
import {MaterialModule} from "../material/material.module";

@NgModule({
  imports: [CommonModule, PubFeedsRoutingModule, MaterialModule, RouterModule],
  declarations: [PubFeedsComponent],
})
export class PubFeedsModule {}
