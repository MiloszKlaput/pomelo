import { DateTime } from "luxon";
import { IssueTypeEnum } from "../models/issue/enums/issue-type.enum";
import { Issue, IssueRequest } from "../models/issue/issue.model";
import { MoveToEpicRequest } from "../models/issue/move-to-epic.model";
import { MoveToSprintRequest } from "../models/issue/move-to-sprint.model";
import { ProjectRequest } from "../models/project/project.model";
import { SprintRequest, SprintResponse, SprintUpdateRequest } from "../models/sprint/sprint.model";
import { MainFormControls } from "../types/main-form-controls.type";

export class RequestBuilder {
  static buildProjectRequest(f: MainFormControls): ProjectRequest {
    return {
      assigneeType: 'PROJECT_LEAD',
      description: f.projectDescription.value!,
      key: f.projectKey.value!.toUpperCase(),
      leadAccountId: f.atlassianUserId.value!,
      name: f.projectName.value!,
      projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      projectTypeKey: 'software',
      url: 'http://atlassian.com'
    }
  }

  static buildSprintsRequest(f: MainFormControls, boardId: number): SprintRequest[] {
    const result: SprintRequest[] = [];
    const sprintsCount = f.sprintsCount.value!;
    const duration = f.sprintDuration.value!;
    let sprintStartDate = 0;

    for (let index = 1; index <= sprintsCount; index++) {
      const sprintData: SprintRequest = {
        originBoardId: boardId,
        name: `Sprint ${index}`,
        goal: `Cel sprintu ${index}`,
        startDate: DateTime.fromJSDate(f.projectStartDate.value!).plus({ days: sprintStartDate }).toISO()!,
        endDate: DateTime.fromJSDate(f.projectStartDate.value!).plus({ days: sprintStartDate + duration }).toISO()!
      };

      sprintStartDate += duration;

      result.push(sprintData);
    }

    return result;
  }

  static buildEpicsRequest(f: MainFormControls, projectKey: string): IssueRequest[] {
    const result: IssueRequest[] = [];
    const epicsCount = f.epicsCount.value!;

    for (let i = 1; i <= epicsCount; i++) {
      result.push(this.createIssue(projectKey, `Tytuł epiki ${i}`, IssueTypeEnum.Epik));
    }

    return result;
  }

  static buildIssuesRequest(f: MainFormControls, projectKey: string): IssueRequest[][] {
    const result: IssueRequest[] = [];
    const issuesCount = f.issuesCount.value!;

    // Założenie: zakres story 60% - 80% wszystkich issues
    const storyPercentage = Math.floor(Math.random() * (80 - 60 + 1)) + 60;
    const remainingPercentage = 100 - storyPercentage;
    // Założenie: taski zajmują minimum 5%
    const taskPercentage = Math.floor(Math.random() * (remainingPercentage - 5 + 1)) + 5;

    const storyCount = Math.floor(issuesCount * (storyPercentage / 100));
    const taskCount = Math.floor(issuesCount * (taskPercentage / 100));
    // Pozostałe issues to bugi
    const bugCount = issuesCount - (storyCount + taskCount);

    const issueTypes: { type: IssueTypeEnum; count: number }[] = [
      { type: IssueTypeEnum.Story, count: storyCount },
      { type: IssueTypeEnum.Bug, count: bugCount },
      { type: IssueTypeEnum.Task, count: taskCount }
    ];

    for (let i = 1; i <= issuesCount; i++) {
      const issueTypeObject = issueTypes.find(t => t.count > 0);

      if (!issueTypeObject) {
        break;
      }

      result.push(this.createIssue(projectKey, `Tytuł zadania ${i}`, issueTypeObject.type));
      issueTypeObject.count--;
    }

    const collectionOfResults: IssueRequest[][] = [];

    while (result.length > 20) {
      collectionOfResults.push(result.splice(0, 20));
    }

    if (result.length > 0) {
      collectionOfResults.push(result);
    }

    return collectionOfResults;
  }


  static buildMoveToEpicRequest(epicsIds: number[], issues: Issue[]): MoveToEpicRequest[] {
    const moveToEpicRequestData: MoveToEpicRequest[] = epicsIds.map(epicId => ({ id: epicId, issuesKeys: [] }));
    const shuffledIssues = issues.sort(() => Math.random() - 0.5);

    for (const issue of shuffledIssues) {
      const randomEpicIndex = Math.floor(Math.random() * epicsIds.length);
      moveToEpicRequestData[randomEpicIndex].issuesKeys.push(issue.key);
    }

    return moveToEpicRequestData;
  }

  static buildMoveToSprintRequest(sprintIssuesAssigment: { [key: string]: { sprintId: number, issues: Issue[] } }): MoveToSprintRequest[] {
    const moveToSprintRequestData: MoveToSprintRequest[] = [];

    for (const [sprintKey, sprintData] of Object.entries(sprintIssuesAssigment)) {
      moveToSprintRequestData.push({
        id: sprintData.sprintId,
        issuesKeys: sprintData.issues.map(issue => issue.key),
      });
    }

    return moveToSprintRequestData;
  }

  static buildUpdateSprintsRequest(sprints: SprintResponse[]): SprintUpdateRequest[] {
    const result: SprintUpdateRequest[] = [];
    const today = DateTime.now();

    for (const sprint of sprints) {
      let stateData;
      const isClosed = DateTime.fromISO(sprint.data.endDate).startOf('day') < today.startOf('day');
      const isActive = DateTime.fromISO(sprint.data.startDate).startOf('day') <= today.startOf('day') && DateTime.fromISO(sprint.data.endDate).startOf('day') > today.startOf('day');

      if (isClosed) {
        stateData = 'closed';
      } else if (isActive) {
        stateData = 'active';
      } else {
        stateData = 'future';
      }

      const sprintData: SprintUpdateRequest = {
        id: sprint.data.id,
        state: stateData,
        name: sprint.data.name,
        startDate: sprint.data.startDate,
        endDate: sprint.data.endDate
      };

      result.push(sprintData);
    }

    return result;
  }

  private static createIssue(projectKey: string, summary: string, issueType: IssueTypeEnum): IssueRequest {
    return {
      fields: {
        project: { key: projectKey },
        summary,
        issuetype: { id: issueType.toString() },
        description: {
          content: [
            {
              content: [
                {
                  text: 'Zadanie założone przez API',
                  type: 'text'
                }
              ],
              type: 'paragraph'
            }
          ],
          type: 'doc',
          version: 1
        }
      }
    };
  }
}
