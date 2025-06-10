import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Level1 } from './level1/level1';
import { Level2 } from './level2/level2';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'level1'},
  { path: 'level1', component: Level1},
  { path: 'level2', component: Level2}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
