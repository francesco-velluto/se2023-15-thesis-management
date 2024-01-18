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
  The 4 new stories are:
  - Update Proposal
  - Copy Proposal
  - Delete Proposal
  - Notify Application Decision

- **Total points committed vs. done:**
  We committed to do 11 points and we did 11 points.

- **Nr of hours planned vs. spent (as a team):**

  Planned: 95h 40m

  Spent: 100h 10m

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
|   #0   |   15    |   -    |  54h 40m   | 61h 20m      |
|   #1   |   6    |   3    |  12h        | 11h          |
|   #2   |   8    |   3    |   10h 30m   | 11h 50m      |
|   #3   |   5    |   3    |   10h 30m   | 11h          |
|   #4   |   3    |   2    |     5h      | 5h           |
| TOTAL |  37   |   11   |  95h 40m    | 100h 10m     |


- **Hours per task average, standard deviation (estimate and actual):**
  - Average Estimate: 2h 01m
  - Average Actual: 2h 06m
  - Standard Deviation Estimate: 2h 10m
  - Standard Deviation Actual: 2h 17m

- **Total task estimation error ratio: (sum of total hours estimation / sum of total hours spent) - 1:**
  - 0.05

## QUALITY MEASURES

- **Unit Testing:**
  - **Total hours estimated:** 11h
  - **Total hours spent:** 11h 45m
  - **Nr of automated unit test cases:** 164
  - **Coverage (if available):** 84-2%
- **E2E testing:**
  - **Total hours estimated:** 12h
  - **Total hours spent:** 13h 25m
- **Code review:**
  - **Total hours estimated:** 2h
  - **Total hours spent:** 2h 10m
- **Technical Debt management:**
  - **Total hours estimated:** 6h (code smells + coverage + bugs + security hotspots issues)
  - **Total hours spent:** 6h 20m
  - **Hours estimated for remediation by SonarQube:** 15h 10m (all code smells)
  - **Hours estimated for remediation by SonarQube only for the selected and planned issues:** 6h
  - **Hours spent on remediation:** 2h 10m
  - **debt ratio (as reported by SonarQube under "Measures-Maintainability"):** was 0.5, now 0.2%
  - **rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):**
    - Reliability: was C, now A
    - Security: was A, now A
    - Maintainability: was A, now A

## ASSESSMENT

- What caused your errors in estimation (if any)?
    - The estimation of all the new stories as requested and subsequently a change in the request led us to spend more time on that activity, even though it was no longer required later on.
    - We have some delays in the implementation of some tasks, for example tasks related to the e2e test or the front-end graphic, due to random or unexpected errors.
    
- What lessons did you learn (both positive and negative) in this sprint?
    - good 😌 Preparing a speech in advance and conducting a rehearsal the day before the demo helped us arrive more prepared for the presentation.
    - good 😌 Designing, thinking, and implementing with a focus on maintaining consistently low technical debt has allowed us to save a significant amount of time in bug fixing, implementing new features, project management in general, etc...
    - good 😌 We have improved communication by discussing a list of things to do before meetings, arriving more prepared and allowing us not to waste too much time. For example, we used Telegram.
    - good 😌 We continued assigning chunks of tasks of the same user story to the same person and this fact avoid dependencies between team members.
    - bad  😕 We should inquire more about certain details, perhaps by actively following the series of questions posed to the Product Owner in the Telegram chat or staying continuously updated by reading the published FAQ. This, for instance, would have allowed us to avoid reworking the implementation of the Virtual Clock.
    - bad  😕 SonarCloud, although an excellent tool, keeping up with all the reported bugs and code smells has slightly increased the development and release time of a feature, leading to an accumulation of delays in case of dependencies among team members.

- Which improvement goals set in the previous retrospective were you able to achieve?
    - We managed to prepare a dataset before the presentation so that we could showcase all the new implemented features and existing functionalities to their best advantage.
    - Furthermore, we also managed to prepare a PowerPoint presentation showcasing the new features implemented in this sprint, aiming for an even better and smoother presentation during the demo.
    - In the implementation of tests (especially end-to-end), we conducted black-box testing, which allowed us to perform more tests and find more bugs.
    

- Which ones you were not able to achieve? Why?
    - None.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Improve the quality of the product, maintaining high coverage and low bugs and code smells, without decreasing the number of story points committed. We can do it continuing working as always, considering the technical debt and SonarCloud.
    - Consult the FAQ document more often in order not to loose some specifications about the user stories we commited and not to waste time in the correction of features. 
    

- One thing you are proud of as a Team!!
    - We promote teamwork and mutual support, ensuring everyone succeeds together. 💜
