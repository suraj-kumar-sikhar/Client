import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteBlog } from './write-blog';

describe('WriteBlog', () => {
  let component: WriteBlog;
  let fixture: ComponentFixture<WriteBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
