import { Component, OnInit, Renderer2, ViewChild, ElementRef , Input} from '@angular/core';
import { SubredditService } from 'src/app/subreddit/subreddit.service';
import { SubredditModel } from 'src/app/subreddit/subreddit-response';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { SubscribeRequestPayload} from 'src/app/subreddit/subscribeRequestPayload';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subreddit-side-bar',
  templateUrl: './subreddit-side-bar.component.html',
  styleUrls: ['./subreddit-side-bar.component.css']
})
export class SubredditSideBarComponent implements OnInit {
  // @ViewChild('id') id: ElementRef;
  // @Input() subredditId;
  // children: string[];

  subreddit:string;

  subreddits: Array<SubredditModel> = [];
  displayViewAll: boolean;
  subredditSubscriptions: Array<String> = [];
  currentUserId: number;
  subscribeRequestPayload : SubscribeRequestPayload;
  subscribeButtonText = ''

  constructor(private renderer: Renderer2, private subredditService: SubredditService, private router: Router, private localStorage: LocalStorageService, private toastr: ToastrService) {
    this.subscribeRequestPayload = {subreddit_id: 0};
    this.subredditService.getAllSubreddits().subscribe(data => {
      if (data.length > 5) {
        this.subreddits = data.splice(0, 5);
        this.displayViewAll = true;
      } else {
        this.subreddits = data;
      }
    });

    this.subredditService.getAllSubredditSubscriptions().subscribe(data => {
      this.subredditSubscriptions = data;
    }, error => {
          throwError(error);
    });

    this.subredditService.getCurrentUserId().subscribe(data => {
      this.currentUserId = data;
    }, error => {
          throwError(error);
    });
    
  }

  ngOnInit(): void { }


  subscribeSubreddit(subreddit_id: number, subreddit_name: string) {
    this.subscribeRequestPayload.subreddit_id = subreddit_id;
    this.subredditService.subscribeSubreddit(this.subscribeRequestPayload).subscribe(data => {
    this.router.navigateByUrl('/subscribeSubreddit/' + this.subscribeRequestPayload.subreddit_id);
    }, error => {
      console.log(error);
      this.toastr.error('Subscribtion Failed! Please try again');
    })

    console.log("successfully subscribed to " + this.subredditSubscriptions)
    this.subredditSubscriptions = this.localStorage.retrieve('subredditSubscriptions');
    this.subredditSubscriptions.push(subreddit_name);
    this.localStorage.store('subredditSubscriptions', this.subredditSubscriptions)
  
    this.subreddit = subreddit_name
    this.showLeaveButton(); 
  }

  leaveSubreddit(subreddit_id: number, subreddit_name: string){

    this.subscribeRequestPayload.subreddit_id = subreddit_id;
        this.subredditService.leaveSubreddit(this.subscribeRequestPayload).subscribe(data => {
      this.router.navigateByUrl('/leaveSubreddit/' + this.subscribeRequestPayload.subreddit_id);
    }, error => {
      console.log(error);
      this.toastr.error('Subscribtion Failed! Please try again');
    })

    this.subredditSubscriptions = this.localStorage.retrieve('subredditSubscriptions');
    this.subredditSubscriptions.splice(this.subredditSubscriptions.indexOf(subreddit_name), 1);
    this.localStorage.store('subredditSubscriptions', this.subredditSubscriptions)

    this.subreddit = subreddit_name
    this.showSubscribeButton(); 
  }

  

  saveToLocal(){
    this.subredditService.saveToLocalStorage(this.subredditSubscriptions, this.currentUserId)
  }

  isSubscribed(subreddit_name : String, subreddit_id: number){
    for(var subredditSubscription of this.subredditSubscriptions){
      if(subredditSubscription == subreddit_name){
        this.subscribeButtonText = 'leave';
        return true;
      } 
    }
    this.subscribeButtonText = 'subscribe';

    return false;
  }

  showSubscribeButton(){
    document.getElementById(this.subreddit).innerHTML = '"<button id={{subreddit.id}} (click)="leaveSubreddit(subreddit.id)" class="btn-sm btn-primary rounded-2 mr-auto">  {{subscribeButtonText}} </button>"';
  }

  showLeaveButton(){
        document.getElementById(this.subreddit).innerHTML = '"<button id={{subreddit.id}} (click)="leaveSubreddit(subreddit.id)" class="btn-sm btn-primary rounded-2 mr-auto">  {{subscribeButtonText}} </button>"';
  }


  // subscribeToSubreddit(subreddit_name: string){
  //     this.isSubscribed(subreddit_name)?   this.showSubscribeButton() :   this.showLeaveButton()
  // }

}
