import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'justafew',
  pure: false
})
export class JustAFewPipe implements PipeTransform {
  public transform(value: any[], start: number): any[] {
    return value.slice(Math.max(0, start - 10), start + 200);
  }
}
