import { MatPaginatorIntl } from '@angular/material';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';



export class PaginatorI18n extends MatPaginatorIntl {

  constructor(private translate: TranslateService) {
    super();
    this.setLabels();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setLabels();
      this.changes.next();
    });
  }

  setLabels() {
      this.itemsPerPageLabel = this.translate.instant('PAGINATION.ITEMS_PER_PAGE_LABEL');
      this.nextPageLabel = this.translate.instant('PAGINATION.NEXT_PAGE_LABEL');
      this.previousPageLabel = this.translate.instant('PAGINATION.PREVIOUS_PAGE_LABEL');
      this.firstPageLabel = this.translate.instant('PAGINATION.FIRST_PAGE_LABEL');
      this.lastPageLabel = this.translate.instant('PAGINATION.LAST_PAGE_LABEL');
      this.getRangeLabel = this.rangeLabel.bind(this);
  }

  private rangeLabel(page: number, pageSize: number, length: number): string {
      if (length === 0 || pageSize === 0) {
          return this.translate.instant('PAGINATION.RANGE_PAGE_LABEL_1', { length });
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return this.translate.instant('PAGINATION.RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex, length });
  }
}
