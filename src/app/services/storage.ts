import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, UploadResult } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);

  uploadImage(file: File) {
    const storageRef = ref(this.storage, `images/${file.name}`);
    return uploadBytes(storageRef, file).then((snapshot: UploadResult) => getDownloadURL(snapshot.ref));
  }
}
