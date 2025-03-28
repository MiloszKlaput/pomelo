import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { IssueRequest, IssueResponse } from '../models/issue/issue.model';
import { SprintRequest, SprintResponse, SprintUpdateRequest } from '../models/sprint/sprint.model';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';
import { ProcessDataService } from './process-data.service';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/';
  private processDataService = inject(ProcessDataService);

  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    const url = this.baseUrl + 'create-project';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      project
    };

    return this.http.post<ProjectResponse>(url, data);
  }

  getBoardId(projectKey: string): Observable<{ data: number }> {
    const url = this.baseUrl + 'get-board-id';
    const params = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      projectKey
    };

    return this.http.get<{ data: number }>(url, { params });
  }

  deleteSprintZero(boardId: number): Observable<any> {
    const url = this.baseUrl + 'delete-sprint-zero';
    const params = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      boardId: boardId.toString()
    };

    return this.http.get<any>(url, { params });
  }

  deleteProject(projectKey: string): Observable<string> {
    const url = this.baseUrl + 'delete-project';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      projectKey
    };

    return this.http.post<string>(url, data);
  }

  createSprint(sprint: SprintRequest): Observable<SprintResponse> {
    const url = this.baseUrl + 'create-sprint';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      sprint
    };

    return this.http.post<SprintResponse>(url, data);
  }

  createIssues(issues: IssueRequest[]): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const url = this.baseUrl + 'create-issues';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      issues
    };

    return this.http.post<{ issues: IssueResponse[], errors: any[] }>(url, data);
  }

  moveIssuesToEpic(moveToEpicData: MoveToEpicRequest): Observable<MoveToEpicRequest> {
    const url = this.baseUrl + 'move-issues-to-epic';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      epicId: moveToEpicData.id,
      issues: moveToEpicData.issuesKeys
    };

    return this.http.post<MoveToEpicRequest>(url, data);
  }

  moveIssuesToSprint(moveToSprintData: MoveToSprintRequest): Observable<MoveToSprintRequest> {
    const url = this.baseUrl + 'move-issues-to-sprint';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      sprintId: moveToSprintData.id,
      issues: moveToSprintData.issuesKeys
    };

    return this.http.post<MoveToSprintRequest>(url, data);
  }

  updateSprints(sprintUpdateRequest: SprintUpdateRequest): Observable<any> {
    const url = this.baseUrl + 'update-sprint';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      jiraBaseUrl: this.processDataService.requestData.atlassianUserJiraUrl,
      sprintId: sprintUpdateRequest.id,
      state: sprintUpdateRequest.state,
      name: sprintUpdateRequest.name,
      startDate: sprintUpdateRequest.startDate,
      endDate: sprintUpdateRequest.endDate
    };

    return this.http.put<any>(url, data);
  }
}
