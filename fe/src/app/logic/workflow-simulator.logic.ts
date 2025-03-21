import { DateTime } from "luxon";
import { RequestData, ResponseData } from "../models/process/process-data.model";
import { Issue } from "../models/issue/issue.model";


export class WorkflowSimulator {
  static storyPointsCollection = [1, 2, 3, 5, 8, 13];
  static scrumTeamMembers = 7;
  static scrumTeamMemberMaximumVelocity = 10;
  static sprintCapacity = WorkflowSimulator.scrumTeamMembers * WorkflowSimulator.scrumTeamMemberMaximumVelocity;

  static simulateBusinessWorkflow(requestData: RequestData, responseData: ResponseData, issues: Issue[]): { [key: string]: { sprintId: number, issues: Issue[] } } {
    const projectStartDate = requestData.projectStartDate;
    const sprintDuration = requestData.sprintDuration;
    const sprintsCount = requestData.sprintsCount;
    const sprints = responseData.sprints;

    let remainingIssues = [...issues];
    let sprintStartDate = projectStartDate;

    const sprintAssignments: { [key: string]: { sprintId: number, issues: Issue[] } } = {};

    let carryOverIssues: Issue[] = [];

    for (let sprint = 0; sprint < sprintsCount; sprint++) {
      let sprintCapacity = WorkflowSimulator.sprintCapacity;
      let sprintIssues: Issue[] = [...carryOverIssues];

      const carryOverStoryPoints = carryOverIssues.reduce((sum, issue) => sum + (issue.fields.storyPoints || 0), 0);
      // pomniejszenie maksymalnych story points o spady
      sprintCapacity -= carryOverStoryPoints;
      carryOverIssues = [];

      sprintAssignments[sprint.toString()] = { sprintId: sprints[sprint].data.id, issues: [] };

      const sprintEndDate = sprintStartDate.plus({ days: sprintDuration });
      const today = DateTime.now();

      while (remainingIssues.length > 0 && sprintCapacity > 0) {
        const currentIssue = remainingIssues[0];
        const storyPoints = this.getRandomStoryPoints();

        if (sprintCapacity >= storyPoints) {
          currentIssue.fields.storyPoints = storyPoints;

          // 80% zadań założonych przed rozpoczęciem sprintu
          const createdBeforeSprint = Math.random() < 0.8;
          const createdDate = createdBeforeSprint
            ? this.randomDateBetween(sprintStartDate.minus({ days: sprintDuration }), sprintStartDate)
            // -3 dni od końca sprintu
            : this.randomDateBetween(sprintStartDate, sprintStartDate.plus({ days: sprintDuration - 3 }));

          currentIssue.fields.created = createdDate.toISO();
          currentIssue.fields.updated = currentIssue.fields.created;
          currentIssue.fields.status = "In Progress";

          if (sprintEndDate < today) {
            currentIssue.fields.status = "Done";
            currentIssue.fields.resolution = "Done";
          }

          sprintAssignments[sprint.toString()].issues.push(currentIssue);
          sprintCapacity -= storyPoints;
          sprintIssues.push(currentIssue);
          remainingIssues.shift();
        } else {
          break;
        }
      }

      // spady 0-10%
      const maxCarryOverIssues = Math.floor(sprintIssues.length * 0.1);
      carryOverIssues = sprintIssues.slice(0, maxCarryOverIssues);

      // spady ustawiane na In progress
      carryOverIssues.forEach(issue => {
        issue.fields.status = "In Progress";
        issue.fields.resolution = undefined;
      });

      sprintStartDate = sprintEndDate;
    }

    return sprintAssignments;
  }

  private static randomDateBetween(start: DateTime, end: DateTime): DateTime {
    const diff = end.diff(start, 'milliseconds').milliseconds;
    if (diff <= 0) {
      return start;
    }
    const offset = Math.floor(Math.random() * diff);
    return start.plus({ milliseconds: offset });
  }

  private static getRandomStoryPoints(): number {
    const randomIndex = Math.floor(Math.random() * WorkflowSimulator.storyPointsCollection.length);
    return WorkflowSimulator.storyPointsCollection[randomIndex];
  }
}
