import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'jv-svg-icons',
  template: ``
})
export class SvgIconsComponent {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    const icons = ['multi-drop'];

    icons.forEach(icon => {
      iconRegistry.addSvgIcon(
        icon,
        sanitizer.bypassSecurityTrustResourceUrl(
          `assets/images/svg-icons/${icon}.svg`
        )
      );
    });
    iconRegistry.addSvgIconSet(
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/svg-icons/mdi.svg'
      )
    );
  }
}
