import { Component, OnInit } from '@angular/core';
import { PubFeedsService } from '../services/pub-feeds.service';

@Component({
  selector: 'app-ftp-management',
  templateUrl: './ftp-management.component.html',
  styleUrls: ['./ftp-management.component.scss'],
})
export class FtpManagementComponent implements OnInit {
  loading: boolean;
  placements = [];
  constructor(private pubFeedsService: PubFeedsService) {}

  ngOnInit() {
    this.loading = true;
    this.pubFeedsService.getFtpPublishers().subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.placements = res;
    });
  }

}
