// MARK: - Imports & Dependencies
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
  User,
  signInWithEmailAndPassword
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

// MARK: - Service Implementation
/**
 * Serviço responsável pelo gerenciamento de autenticação e sessão do usuário via Firebase Auth.
 * Provê métodos reativos para observação do estado da sessão e autenticação federada/credenciais.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // MARK: - Injected Dependencies & State
  private auth = inject(Auth);

  /**
   * Stream reativa que emite o objeto do usuário autenticado no Firebase ou null se anônimo.
   */
  readonly user$: Observable<User | null> = user(this.auth);

  constructor() {}

  // MARK: - Authentication Methods
  /**
   * Realiza login federado utilizando a conta Google através de popup.
   *
   * @returns {Promise<void>} Promessa resolvida quando a autenticação é concluída com sucesso.
   * @throws {Error} Lança o erro capturado caso o popup seja bloqueado ou cancelado.
   */
  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  /**
   * Realiza login utilizando e-mail institucional e senha cadastrada.
   *
   * @param {string} email - Endereço de e-mail do usuário.
   * @param {string} pass - Senha em texto simples a ser validada pelo Firebase Auth.
   * @returns {Promise<void>} Promessa resolvida ao autenticar com sucesso.
   * @throws {Error} Lança erro de credenciais inválidas ou conta desativada.
   */
  async loginWithEmail(email: string, pass: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
    } catch (error) {
      console.error('Login with email failed', error);
      throw error;
    }
  }

  /**
   * Encerra a sessão ativa do usuário no Firebase Auth.
   *
   * @returns {Promise<void>} Promessa resolvida após revogar a sessão local.
   */
  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
