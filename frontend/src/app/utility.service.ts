import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  customSort(a: any, b: any): number {
    const order = [
      '1',
      '2',
      'Summer Term 1',
      '3',
      '4',
      'Summer Term 2',
      '5',
      '6',
      'Summer Term 3',
      '7',
      '8',
      'Summer Term 4',
      '9',
      '10',
    ];

    // Convert a and b to strings if they are numbers
    const strA = typeof a === 'number' ? a.toString() : a;
    const strB = typeof b === 'number' ? b.toString() : b;

    const indexA = order.indexOf(strA);
    const indexB = order.indexOf(strB);

    return indexA - indexB;
  }
}
