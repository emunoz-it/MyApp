import { Component, OnInit } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, query, collection, collectionData, DocumentData, doc, updateDoc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MyApp';
  datas$!: Observable<DocumentData[]>;
  url!: string;

  constructor(
    private readonly _fireStore: Firestore,
    private readonly _auth: Auth,
    private readonly _storage: Storage
  ) {}

  ngOnInit(): void {
    this.readDocs();
  }

  readDocs(): void {
    const refColl = collection(this._fireStore, 'demo');
    const q = query(refColl);
    this.datas$ = collectionData(q, { idField: '_id' });
  }

  addDoc(): void {
    const id = Date.now();
    const refDoc = doc(this._fireStore, 'demo/' + id);
    setDoc(refDoc, { title: 'new Title' });
  }

  updateDoc(id: string): void {
    const data = prompt('new title')
    const refDoc = doc(this._fireStore, 'demo/' + id);
    updateDoc(refDoc, { title: data });
  }

  deleteDoc(id: string): void {
    const refDoc = doc(this._fireStore, 'demo/' + id);
    deleteDoc(refDoc);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this._auth, provider);
  }

  async uploadFile($event: any) {
    const file: File = $event.target.files[0];
    const id = Date.now();
    const refStorage = ref(this._storage, 'demo/' + id + '/' + file.name);
    const uploadTask = await uploadBytes(refStorage, file);
    const url = await getDownloadURL(uploadTask.ref);
    this.url = url;
    console.log({
      ref: uploadTask.ref,
      url: url
    });
  }
}
