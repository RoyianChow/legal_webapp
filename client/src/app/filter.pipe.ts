import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      // Perform filtering logic based on your requirements
      // For example, check if the item's title contains the searchText
      return item.title.toLowerCase().includes(searchText);
    });
  }
}
