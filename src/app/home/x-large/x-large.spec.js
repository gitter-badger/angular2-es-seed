import {
  it,
  injectAsync,
  describe,
  TestComponentBuilder
} from 'angular2/testing';

import { Component } from 'angular2/core';

// Load the implementations that should be tested
import { XLarge } from './x-large.directive';

describe('x-large directive', () => {
  // Create a test component to test directives
  @Component({
    template: '',
    directives: [XLarge]
  })
  class TestComponent {
  }

  it('should sent font-size to x-large', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div x-large>Content</div>')
      .createAsync(TestComponent).then((fixture:any) => {
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement.children[0];
        expect(compiled.style.fontSize).toBe('x-large');
      });
  }));

});
