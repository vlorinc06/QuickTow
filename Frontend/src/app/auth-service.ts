import { computed, Injectable, signal } from '@angular/core';
import { UserService } from './user-service';

export interface AuthUser{
  id: number,
  type: 'user' | 'towUser' 
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<AuthUser | null>(null);


  isLoggedIn = computed(()=>this.currentUser() !== null);
  isTowUser = computed(()=> this.currentUser()?.type === 'towUser');
  isRegularUser = computed(()=> this.currentUser()?.type === 'user');

  isRequesting = signal<boolean>(false);

  constructor(private user: UserService){
    const saved = localStorage.getItem('authUser');
    if(saved){
      const parsed = JSON.parse(saved) as AuthUser;
      this.setUser(parsed);
    }
  }

  setUser(user: AuthUser | null){
    this.currentUser.set(user);

    if(user){
      localStorage.setItem('authUser',JSON.stringify(user));
    }
    else{
      localStorage.removeItem('authUser');
    }

    if(user?.type == "user")
    {
      this.user.getUser(user.id).subscribe({
        next: (res) =>{
          this.user.user.set(res);
        }
      })
    }
    
  }

  logout() {
    this.currentUser.set(null);
  }
}
