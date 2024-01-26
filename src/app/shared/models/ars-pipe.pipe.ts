import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arsPipe'
})
export class ArsPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
