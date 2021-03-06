/**
 * Created by zhuyan6 on 16/4/6.
 */
import {Component, OnInit} from 'angular2/core';

import {RouteParams, Router} from 'angular2/router';
import {CanDeactivate, ComponentInstruction} from 'angular2/router';

import {DialogService} from '../../service/dialog.service';

import {Crisis, CrisisService}         from '../../service/crisis.service';

@Component({
    template: `
  <div *ngIf="crisis">
    <h3>"{{editName}}"</h3>
    <div>
      <label>Id: </label>{{crisis.id}}</div>
    <div>
      <label>Name: </label>
      <input [(ngModel)]="editName" placeholder="name"/>
    </div>
    <p>
      <button (click)="save()">Save</button>
      <button (click)="cancel()">Cancel</button>
    </p>
  </div>
  `,
    styles: ['input {width: 20em}']
})
//console.log("DialogService",DialogService)
export class CrisisDetailComponent implements OnInit, CanDeactivate {
    crisis: Crisis;
    editName: string;
    constructor(
        private _service: CrisisService,
        private _router: Router,
        private _routeParams: RouteParams
        //private _dialog: DialogService
    ) { }
    ngOnInit() {
        let id = +this._routeParams.get('id');
        this._service.getCrisis(id).then(crisis => {
            if (crisis) {
                this.editName = crisis.name;
                this.crisis = crisis;
            } else { // id not found
                this.gotoCrises();
            }
        });
    }
    routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction) : any {
        // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged.
        if (!this.crisis || this.crisis.name === this.editName) {
            return true;
        }
        // Otherwise ask the user with the dialog service and return its
        // promise which resolves to true or false when the user decides
        //return this._dialog.confirm('Discard changes?');
        //return alert('Discard changes?');
    }
    cancel() {
        this.editName = this.crisis.name;
        this.gotoCrises();
    }
    save() {
        this.crisis.name = this.editName;
        this.gotoCrises();
    }
    gotoCrises() {
        // Like <a [routerLink]="['CrisisList']">Crisis Center</a
        //this._router.navigate(['CrisisList']);//
        let crisisId = this.crisis ? this.crisis.id : null;
        this._router.navigate(['CrisisList', {id: crisisId, foo: 'foo'} ]);
    }
}