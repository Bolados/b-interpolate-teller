import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { MathjaxComponent } from './mathjax.component';

@NgModule({
  declarations: [
    MathjaxComponent
  ],
  imports: [
    FormsModule,
    SharedModule,
  ],
  exports: [
    MathjaxComponent
  ]
})
export class MathjaxModule {}
