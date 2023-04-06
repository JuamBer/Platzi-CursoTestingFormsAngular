import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { generateManyProducts } from 'src/app/models/product.mock';
import { ProductsService } from 'src/app/services/product.service';

import { ValueService } from 'src/app/services/value.service';
import { getText, queryById } from 'src/testing';
import {
  mockObservable,
  observableError,
  observableSuccess,
} from 'src/testing/async-data';
import { ProductComponent } from './../product/product.component';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductsService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductsService', ['getAll']);
    const valueServiceSpy = jasmine.createSpyObj('ValueService', [
      'getPromiseValue',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      providers: [
        { provide: ProductsService, useValue: spy },
        { provide: ValueService, useValue: valueServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
    const productsMock = generateManyProducts(3);
    productService.getAll.and.returnValue(mockObservable(productsMock));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Tests for getAllProducts', () => {
    it('should return a product list from service', () => {
      // Arrange
      const productsMock = generateManyProducts(10);
      const lengthPrev = component.products.length;
      productService.getAll.and.returnValue(mockObservable(productsMock));
      // Act
      component.getAllProducts();
      fixture.detectChanges();
      // Assert
      expect(component.products.length).toEqual(
        productsMock.length + lengthPrev
      );
      expect(productService.getAll).toHaveBeenCalled();
    });

    it('should return change the status "loading" => "success"', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(observableSuccess(productsMock));

      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(); // flush the observable and resolve data
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('success');
      expect(productService.getAll).toHaveBeenCalled();
    }));

    it('should return change the status "loading" => "error"', fakeAsync(() => {
      // Arrange
      productService.getAll.and.returnValue(observableError());

      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(2000); // flush the observable and resolve data
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('error');
      expect(productService.getAll).toHaveBeenCalled();
    }));
  });

  describe('test for callPromise', () => {
    it('call promise', async () => {
      // Arrange
      const mockValue = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockValue));
      // Act
      await component.callPromise();
      fixture.detectChanges();
      // Assert
      expect(component.rta).toEqual(mockValue);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
    });

    it('should show "my mock string" in <p> when btn was clicked', fakeAsync(() => {
      // Arrange
      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      // const btnDe = fixture.debugElement.query(By.css('.btn-promise'));
      const btnDe = queryById(fixture, 'btn-promise');

      // Act
      btnDe.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();
      const textRta = getText(fixture, 'rta');
      // Assert
      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
      expect(textRta).toEqual(mockMsg);
    }));
  });
});
