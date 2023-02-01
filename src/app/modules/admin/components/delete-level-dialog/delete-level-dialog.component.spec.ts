import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLevelDialogComponent } from './delete-level-dialog.component';

describe('DeleteLevelDialogComponent', () => {
  let component: DeleteLevelDialogComponent;
  let fixture: ComponentFixture<DeleteLevelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteLevelDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
