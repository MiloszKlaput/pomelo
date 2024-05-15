import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-get-issue-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-issue-form.component.html',
  styleUrl: './get-issue-form.component.scss'
})
export class GetIssueFormComponent {
  private http = inject(HttpClient);

  issue: any = null;

  getIssue(getIssueForm: NgForm) {


    // PRZENIEŚĆ do express.js

    // console.log(getIssueForm.form.value);
    // const issueId = getIssueForm.form.value.issue;
    // const url = `https://pomelopw.atlassian.net/rest/api/latest/issue/${issueId}`;
    // this.http.get(url)
    //   .subscribe(result => this.issue = result);

    //
    const state = getIssueForm.form.value.name;
    const url = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=yRd15vgP18qGpO4Nfa398zEa6KlDfbWa&scope=read%3Aservicedesk-request&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F&state=${state}&response_type=code&prompt=consent`;
    this.http.get(url)
      .subscribe(result => console.log(result));
  }
}