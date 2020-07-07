import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], order: string, sortReverse: boolean, ...args: any[]): any[] {
      if (!value) { return value; } // no array
      else if (value.length <= 1) { return value; } // array with only one item
      else {
        if(order) {
          value.sort((a, b) => a[order] < b[order] ? 1 : -1);
          /*line 14-48 required only if by default on every column we have to start with asc sort*/
          if(sortReverse) {
            if(order === 'id'){
              sortReverse = true;
            }
            else if(order === 'assetName'){
              sortReverse = true;
            }
            else if(order === 'price'){
              sortReverse = true;
            }
            else if(order === 'lastUpdate'){
              sortReverse = true;
            }
            else if(order === 'type'){
              sortReverse = true;
            }
          }   
          else if(!sortReverse) {
            if(order === 'id'){
              sortReverse = false;
            }
            else if(order === 'assetName'){
              sortReverse = false;
            }
            else if(order === 'price'){
              sortReverse = false;
            }
            else if(order === 'lastUpdate'){
              sortReverse = false;
            }
            else if(order === 'type'){
              sortReverse = false;
            }
          }      
        }
        return sortReverse ? value.sort().reverse() : value.sort();
    }
  }

}
