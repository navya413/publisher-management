import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-entity-nav',
  templateUrl: './entity-nav.component.html',
  styleUrls: ['./entity-nav.component.scss'],
})
export class EntityNavComponent implements OnInit, OnChanges {
  agencies;
  loading;

  @Input() clientTree;
  @Input() routeData;

  entityNavTree;
  @Input() selectedAgency: string;

  autocompleteControl: FormControl;
  filteredAutocompleteOptions: Observable<any[]>;
  autocompleteOptions = [];

  @Output() onAgencyChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService,
  ) {
    this.autocompleteControl = new FormControl();
    this.filteredAutocompleteOptions = <Observable<any[]>>this.autocompleteControl.valueChanges.startWith(null).map(query => {
      return query
        ? this.filterAutocompleteOptions(query)
        : this.autocompleteOptions.slice();
    });

    utilService.getAgencies().subscribe(data => {
      this.agencies = data;
    });
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.clientTree && this.routeData) {
      this.buildAutocompleteOptions();
      this.buildEntityNavTree();
    }
  }

  onSelectionChange(val) {
    this.entityNavTree = undefined;
    this.onAgencyChange.emit(val.value);
  }

  buildEntityNavTree() {
    const clientTree = this.clientTree;
    const routeData = this.routeData;
    const entityNavTree = JSON.parse(JSON.stringify(clientTree));
    try {
      let activeClient, activeCampaign, activeJobgroup;
      switch (routeData.data.level) {
        case 'client':
          activeClient = entityNavTree.filter(
            item => item.id === routeData.params.clientId,
          )[0];
          activeClient.isOpen = true;
          activeClient.isActive = true;
          break;

        case 'campaign':
          activeClient = entityNavTree.filter(
            client => client.id === routeData.params.clientId,
          )[0];
          activeCampaign = activeClient.children.filter(
            campaign => campaign.id === routeData.params.campaignId,
          )[0];
          activeClient.isOpen = activeCampaign.isOpen = true;
          activeClient.isActive = false;
          activeCampaign.isActive = true;
          break;

        case 'jobgroup':
          activeClient = entityNavTree.filter(
            client => client.id === routeData.params.clientId,
          )[0];
          activeCampaign = activeClient.children.filter(
            campaign => campaign.id === routeData.params.campaignId,
          )[0];
          activeJobgroup = activeCampaign.children.filter(
            jobgroup => jobgroup.id === routeData.params.jobgroupId,
          )[0];
          activeClient.isOpen = activeCampaign.isOpen = true;
          activeClient.isActive = false;
          activeCampaign.isActive = false;
          activeJobgroup.isActive = true;
          break;
      }
    } catch (e) {
      console.log(e);
      // this.router.navigateByUrl('/error');
    }
    this.entityNavTree = entityNavTree;
  }

  /**
   * Builds autocomplete options from the clientTree.
   */
  buildAutocompleteOptions() {
    const flatList = this.flattenEntityTree(this.clientTree, true);
    this.autocompleteOptions = flatList.map(entity => {
      entity.routerLinkArray = this.getRouterLink(entity);
      entity.breadcrumb = this.getBreadcrumb(entity);
      return entity;
    });
  }

  filterAutocompleteOptions(query) {
    return this.autocompleteOptions.filter(option => {
      return option.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    });
  }

  onAutocompleteOptionSelect(event, option) {
    if (!event.isUserInput) {
      return;
    }
    setTimeout(() => {
      this.autocompleteControl.setValue('');
    }, 0);
    this.router.navigate(option.routerLinkArray, { relativeTo: this.route });
  }

  flattenEntityTree(clientTree, sort = false) {
    if (!clientTree) {
      throw new Error('Missing argument: clientTree');
    }
    const flatList = [];
    const tree = JSON.parse(JSON.stringify(clientTree));
    tree.forEach(client => {
      flatList.push({
        id: client.id,
        name: client.name,
        type: 'client',
      });
      if (client.children && client.children.length) {
        client.children.forEach(campaign => {
          flatList.push({
            id: campaign.id,
            name: campaign.name,
            clientId: client.id,
            clientName: client.name,
            type: 'campaign',
          });
          if (campaign.children && campaign.children.length) {
            campaign.children.forEach(jobgroup => {
              flatList.push({
                id: jobgroup.id,
                name: jobgroup.name,
                campaignId: campaign.id,
                campaignName: campaign.name,
                clientId: client.id,
                clientName: client.name,
                type: 'jobgroup',
              });
            });
          }
        });
      }
    });
    if (sort) {
      flatList.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
    }

    return flatList;
  }

  getBreadcrumb(entity) {
    switch (entity.type) {
      case 'client':
        return '';
      case 'campaign':
        return `${entity.clientName} >`;
      case 'jobgroup':
        return `${entity.clientName} > ${entity.campaignName} >`;
    }
  }

  getRouterLink(entity) {
    if (!entity) {
      throw new Error('Missing argument: entity');
    }
    switch (entity.type) {
      case 'client':
        return ['./', 'agency', this.selectedAgency, 'client', entity.id];
      case 'campaign':
        return [
          './',
          'agency',
          this.selectedAgency,
          'client',
          entity.clientId,
          'campaign',
          entity.id,
        ];
      case 'jobgroup':
        return [
          './',
          'agency',
          this.selectedAgency,
          'client',
          entity.clientId,
          'campaign',
          entity.campaignId,
          'jobgroup',
          entity.id,
        ];
      default:
        return ['./'];
    }
  }
}
