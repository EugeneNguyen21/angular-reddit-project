import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubredditModel } from './subreddit-response';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { SubscribeRequestPayload} from 'src/app/subreddit/subscribeRequestPayload';


@Injectable({
  providedIn: 'root'
})
export class SubredditService {
  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  getAllSubreddits(): Observable<Array<SubredditModel>> {
    return this.http.get<Array<SubredditModel>>('http://localhost:8080/api/subreddit');
  }

  createSubreddit(subredditModel: SubredditModel): Observable<SubredditModel> {
    return this.http.post<SubredditModel>('http://localhost:8080/api/subreddit',
      subredditModel);
  }

  subscribeSubreddit(subscribeRequestPayload: SubscribeRequestPayload): Observable<any>{
    return this.http.post('http://localhost:8080/api/subreddit/subscribeSubreddit/' + subscribeRequestPayload.subreddit_id, 
    subscribeRequestPayload,  { responseType: 'text' });
  }

  getAllSubredditSubscriptions(): Observable<Array<String>>{
    return this.http.get<Array<String>>('http://localhost:8080/api/subredditSubscription');
}
 
  getCurrentUserId(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/auth/currentUserId');
  }

  saveToLocalStorage(subredditSubscriptions: Array<String>, currentUserId: number ){
    this.localStorage.store('subredditSubscriptions', subredditSubscriptions);
    this.localStorage.store('currentUserId', currentUserId);
  }


  leaveSubreddit(subscribeRequestPayload: SubscribeRequestPayload): Observable<any>{
    return this.http.post('http://localhost:8080/api/subreddit/leaveSubreddit/' + subscribeRequestPayload.subreddit_id, 
    subscribeRequestPayload,  { responseType: 'text' });
  }


  

}
