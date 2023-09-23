import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class PipePipe implements PipeTransform {

  transform(value : Date): any {
    const currentYear = new Date().getFullYear();
     const dobYear = new Date(value).getFullYear();     
     const age = currentYear - dobYear;
    return age ;
  }

}
 