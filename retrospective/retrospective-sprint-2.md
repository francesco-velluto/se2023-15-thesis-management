RETROSPECTIVE (Team 15)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- **Number of stories committed vs. done:**
  we committed to do 4 stories and we did 4 stories.
  Those are the 4 stories after the 3 we already did, all in order of business value.
  The 4 new stories are:
  - Browse Applications
  - Accept Application
  - Browse Application Decisions
  - Browse Proposals

- **Total points committed vs. done:**
  We committed to do 11 points and we did 11 points.

- **Nr of hours planned vs. spent (as a team):**
  we planned to spend 96h hours (16 hours for each one of the 6 team members)
  and we spent 90h 40m

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
|   0    |   27   |   -    |   64h 30m   |   58h 5m   |
|   4    |4 (this sprint)|   3    | 4h | 4h 55m |
|   5    |6 (this sprint)|   2    | 9h | 13h 20m |
|   6    |5 (this sprint)|   3    | 7h 30m | 8h 10m |
|   7    |   6    |   3    | 11h | 6h 10m |


- **Hours per task average, standard deviation (estimate and actual):**
  - Average Estimate: 2h
  - Average Actual: 1h 53m
  - Standard Deviation Estimate: 1h 21m
  - Standard Deviation Actual: 1h 35m

- **Total task estimation error ratio: (sum of total hours estimation / sum of total hours spent) - 1:**
  - 0.06


## QUALITY MEASURES

- **Unit Testing:**
  - **Total hours estimated:** 7h
  - **Total hours spent:** 11h 5m
  - **Nr of automated unit test cases:** 71
  - **Coverage (if available):** 68.20%
- **E2E testing:**
  - **Total hours estimated:** 16h
  - **Total hours spent:** 12h
- **Code review:**
  - **Total hours estimated:** 4h 30m
  - **Total hours spent:** 3h



## ASSESSMENT

- What caused your errors in estimation (if any)?
    - We overestimated the time to counterbalance the previous sprint where we underestimated the time. 
    - Without many details about a task it was difficult to estimate the time : especially for SAML login, it was totally new, so it was difficult to know of how many subtasks it was composed.
    - A lot of unit test were already made in the first sprint so it saved a lot of time for the second sprint because we could reuse them.
    - The bugfixing task was underestimated because you cannot predict the number of bugs.

- What lessons did you learn (both positive and negative) in this sprint?
    - good 😌 The code review is important to discover bugs.
    - good 😌 Sonarcloud is very useful to maintain a working "main", each time you commit a test is runned.
    - good 😌 Assign a user story to more than 3 people reduce the efficiency since each person depend on the other one.
    - good 😌 Put two people on a long task such as login make it softer.
    - bad  :( We have to test everything more frequently to avoid breaking the app.

- Which improvement goals set in the previous retrospective were you able to achieve?
    - We kept the frontend coherent from the beginning, since we assigned before the task to a person.
  
- Which ones you were not able to achieve? Why?
    - We were not able to achieve a better estimation of task (we overestimated), because we did not want to underestimate as the previous sprint. But we failed AGAIN.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Find a better way of performing the estimation in order to be more precise in the planning.
    - Prepare test data at the beginning of the sprint in order to develop more coherent functionnalities, work with correct test data and show all funtionnalities during the demo.
    - Consider the technical debt during the implementation phase in order to avoid future fixes.
    - Do black box testing to find other possible bugs.

- One thing you are proud of as a Team!!
    - We are very collaborative and help each others. 💜

