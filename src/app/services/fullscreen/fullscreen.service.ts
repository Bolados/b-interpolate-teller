import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {

  isActive: boolean = true;

  @Output() fullscreenEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  toggleFullscreen(state) {
    this.isActive = state;
    this.fullscreenEmitter.emit(this.isActive);
  }

  isFullscreen() {
    return this.isActive;
  }

}
