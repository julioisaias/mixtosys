import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import 'firebase/firestore';

export interface PeriodicElement {
  pedido: string;
  cliente: number;
  fecha: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  datosPedido: any = undefined;
  datosCliente: any = undefined;

  items: Observable<any[]>;

  displayedColumns: string[] = ['pedido', 'cliente', 'fecha', 'acciones'];

  dataSource: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {  }

  ngOnInit(): void {
    this.items = this.firestore.collection('pedidos').snapshotChanges();

    this.dataSource = this.items.pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    // this.dataSource = this.items;
  }

  addItem() {
    this.firestore.collection('pedidos').add({
      pedido: this.datosPedido,
      cliente: this.datosCliente,
      fecha: Date()
    });

    this.datosPedido = null;
    this.datosCliente = null;
  }

  deleteItem(itemKey) {
     this.firestore.collection('pedidos').doc(itemKey).delete();
  }

}
