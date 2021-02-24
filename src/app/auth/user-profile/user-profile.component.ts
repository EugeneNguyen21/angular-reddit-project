import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/post.service';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post-model';
import { CommentPayload } from 'src/app/comment/comment.payload';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { SubredditService } from 'src/app/subreddit/subreddit.service';





@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  name: string;
  posts: PostModel[];
  comments: CommentPayload[];
  postLength: number;
  commentLength: number;
  currentUserId: number;
  subredditSubscriptions: Array<String> = [];

  constructor(private subredditService: SubredditService, private activatedRoute: ActivatedRoute, private postService: PostService,
    private commentService: CommentService, private httpClient: HttpClient, private localStorage: LocalStorageService) {
    this.name = this.activatedRoute.snapshot.params.name;

    this.postService.getAllPostsByUser(this.name).subscribe(data => {
      this.posts = data;
      this.postLength = data.length;
    });
    this.commentService.getAllCommentsByUser(this.name).subscribe(data => {
      this.comments = data;
      this.commentLength = data.length;
    });

    this.subredditService.getAllSubredditSubscriptions().subscribe(data => {
      this.subredditSubscriptions = data;
    })

    this.subredditService.getCurrentUserId().subscribe(data => {
      this.currentUserId = data;
    })
  }

  ngOnInit(): void {
    // this.setAllSubredditSubscription();
    // this.setCurrentUserId();
    // this.localStorage.store('currentUserId',this.currentUserId);
    // this.localStorage.store('subredditSubscriptions', this.subredditSubscriptions)
  }

  // getAllSubredditSubscription(): Observable<Array<String>> {
  //   return this.httpClient.get<Array<String>>('http://localhost:8080/api/subredditSubscription');
  // }

  // setAllSubredditSubscription(){
  //   this.getAllSubredditSubscription().subscribe(data => {
  //     this.subredditSubscriptions = data;
  //   }, error => {
  //     throwError(error);
  //   });
  // }

  // getCurrentUserId(): Observable<number> {
  //   return this.httpClient.get<number>('http://localhost:8080/api/auth/currentUserId');
  // }


  // setCurrentUserId(){
  //   this.getCurrentUserId().subscribe(data => {
  //     this.currentUserId = data;
  //   }, error => {
  //     throwError(error);
  //   });
  // }

  showUserId(){
    // this.setAllSubredditSubscription();
    // this.setCurrentUserId();
    // this.localStorage.store('subredditSubscriptions', this.subredditSubscriptions)
    // this.localStorage.store('currentUserId',this.currentUserId);

  }

}
