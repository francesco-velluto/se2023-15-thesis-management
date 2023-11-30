TEMPLATE FOR RETROSPECTIVE (Team 15)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- **Number of stories committed vs. done:**


- **Total points committed vs. done:**


- **Nr of hours planned vs. spent (as a team):**


### Detailed statistics



- **Hours per task average, standard deviation (estimate and actual):**


- **Total task estimation error ratio: (sum of total hours estimation / sum of total hours spent) - 1:**


## QUALITY MEASURES

- **Unit Testing:**
  - **Total hours estimated:** 7h 45m (this comprises the stories we didn't do)
  - **Total hours estimated:** 4h 30m (only stories done)
  - **Total hours spent:** 5h 5m (only stories done)
  - **Nr of automated unit test cases:** 41
  - **Coverage (if available):** 62.78%
- **E2E testing:**
  - **Total hours estimated:** 11h 45m (this comprises the stories we didn't do)
  - **Total hours estimated:** 8h (only stories done)
  - **Total hours spent:** 5h 5m (only stories done)
- **Code review:**
  - **Total hours estimated:** 4h 15m (this comprises the stories we didn't do)
  - **Total hours estimated:** 2h 15m (only stories done)
  - **Total hours spent:** 1h 45m (only stories done)

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

