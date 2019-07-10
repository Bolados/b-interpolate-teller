import {EventEmitter, Injectable, Output} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Theme} from '../../domains';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  @Output() themeChanged: EventEmitter<Theme> = new EventEmitter();
  protected suffix = '-theme';
  private theme: Theme = Theme.DEFAULT;

  getThemeShort(): Theme {
    return this.theme;
  }

  getThemeFull(): string {
    return this.theme + this.suffix;
  }

  run(theme: Theme) {
    this.theme = theme;
    this.themeChanged.emit(this.theme);
    return this;
  }

  // remove old theme class and add new theme class
  // we're removing any css class that contains '-theme' string but your theme classes can follow any pattern

  removeOld(overlayContainer: OverlayContainer) {
    if (overlayContainer) {
      const overlayContainerClasses = overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses)
        .filter((item: string) => item.includes(this.suffix));
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
    }
  }

  addTo(overlayContainer: OverlayContainer) {
    if (overlayContainer) {
      overlayContainer.getContainerElement().classList.add(this.getThemeFull());
    }
  }

  updateTheme(overlayContainer: OverlayContainer) {
    this.removeOld(overlayContainer);
    this.addTo(overlayContainer);
  }
}
