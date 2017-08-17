import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaGeneratorComponent } from './area-generator.component';

describe('AreaGeneratorComponent', () => {
  let component: AreaGeneratorComponent;
  let fixture: ComponentFixture<AreaGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
