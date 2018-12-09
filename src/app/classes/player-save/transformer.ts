export interface Transformer<T> {

  from(data: any): T;
  to(data: T): any;

}
