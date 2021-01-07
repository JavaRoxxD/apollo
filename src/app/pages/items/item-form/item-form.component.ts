import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Item } from "../shared/item.model";
import { ItemService } from "../shared/item.service";

import { switchMap } from "rxjs/operators";

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit, AfterContentChecked {


  currentAction!: string;
  itemForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessages!: string[];
  subittingForm: boolean = false;
  item: Item = new Item();


  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildItemForm();
    this.loadItem();
  }



  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm(){
    this.subittingForm = true;

    if(this.currentAction == "new")
      this.createItem();
    else
    this.updateItem();
  }

  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    }
    else{
      this.currentAction = "edit";
    }
  }

  private buildItemForm(){
    this.itemForm = this.formBuilder.group({
      _id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null, Validators.required],
      quantity: [null, Validators.required]
    });
  }

  private loadItem(){
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.itemService.getById(params.get("_id")!))
      )
      .subscribe(
        (item) => {
          this.item = item;
          this.itemForm?.patchValue(item); //! binds loaded item data to ItemForms
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde!')
      )
    }
  }


  private setPageTitle() {

    if (this.currentAction == 'new') {
      this.pageTitle = "Cadastro de Novo Item";
    } else {

      const itemName = this.item.name || "";
      this.pageTitle = "Editando Item: " + itemName;
    }

  }


  private createItem() {
    const item: Item = Object.assign(new Item(), this.itemForm.value);

    this.itemService.create(item)
    .subscribe(
      item => this.actionsForSucces(item),
      error => this.actionsForError(error)
    )
  }

  private updateItem() {
    const item: Item = Object.assign(new Item(), this.itemForm.value);

    this.itemService.update(item)
    .subscribe(
      item => this.actionsForSucces(item),
      error => this.actionsForError(error)
    )
  }

  actionsForSucces(item: Item){
    this.toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl("items", {skipLocationChange: true}).then(
      () => this.router.navigate(["items", item._id, "edit"])
    );
  }

  actionsForError(error: any){
    this.toastr.error('Ocorreu um erro ao processar sua solicitação!');

    this.subittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor tente mais tarde."]
  }


}
