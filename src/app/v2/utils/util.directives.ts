import { Directive, ElementRef, HostListener} from '@angular/core'

@Directive({
    selector: 'input[numbersOnly]'
})
export class NumberDirective {
    constructor(private elRef: ElementRef) {  
    } 
    @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {  
        const initalValue = this.elRef.nativeElement.value;
        this.elRef.nativeElement.value = parseFloat(Math.abs(initalValue).toFixed(2));
        if ( initalValue !== this.elRef.nativeElement.value) {
          event.stopPropagation();
        }
      }
}