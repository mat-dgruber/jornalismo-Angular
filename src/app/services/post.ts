import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Post {
  id?: string;
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsCollection = collection(this.firestore, 'posts');

  constructor(private firestore: Firestore) { }

  getPosts(): Observable<Post[]> {
    return collectionData(this.postsCollection, { idField: 'id' }) as Observable<Post[]>;
  }

  getPost(id: string): Observable<Post> {
    const postDoc = doc(this.firestore, `posts/${id}`);
    return docData(postDoc, { idField: 'id' }) as Observable<Post>;
  }

  createPost(post: Post) {
    return addDoc(this.postsCollection, post);
  }

  updatePost(post: Post) {
    const postDoc = doc(this.firestore, `posts/${post.id}`);
    return updateDoc(postDoc, { title: post.title, content: post.content });
  }

  deletePost(id: string) {
    const postDoc = doc(this.firestore, `posts/${id}`);
    return deleteDoc(postDoc);
  }
}
