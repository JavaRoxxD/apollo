import { Component, OnInit } from '@angular/core';

import { Item } from "../shared/item.model";
import { ItemService } from "../shared/item.service";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {


  items: Item[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {

    this.itemService.getAll().subscribe(
      items => this.items = items,
      error => alert('Erro ao carregar a lista')
    )



  }

  deleteItem(item: Item){

    const mustDelete = confirm('Deseja realmente deletar esse item?');

    if(mustDelete){
      this.itemService.delete(item._id!).subscribe(
        () => this.items = this.items.filter(element => element != item),
        () => alert('Erro ao tentar excluir!')
      )
      }
  }

  alerta(){
    alert('Excluir');
  }
}
