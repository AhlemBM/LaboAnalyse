import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitAdminComponent } from './kit-admin.component';

describe('KitAdminComponent', () => {
  let component: KitAdminComponent;
  let fixture: ComponentFixture<KitAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
