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
  we committed to do 5 stories and we did 5 stories.
  The 5 new stories are:
  - Archive Proposal
  - Access applicant CV
  - Notify Application
  - Proposal expiration
  - Insert Student Request

- **Total points committed vs. done:**
  We committed to do 27 points and we did 27 points.

- **Nr of hours planned vs. spent (as a team):**

  Planned: 96h 05m

  Spent: 100h 15m

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
|   #0   |    16   |   -    |  54h 40m   |   61h 20m    |
|   #1   |    6    |   5    |     8h     |   9h 10m     |
|   #2   |    8    |   8    |    16h     |   18h 20m    |
|   #3   |    6    |   3    |     7h     |   6h 05m     |
|   #4   |    3    |   3    |     4h     |     4h       |
|   #5   |    7    |   8    |  10h 30m   |   11h 25m    |
| TOTAL  |    46   |   27   |  50h 35m   |   51h 15m    |


- **Hours per task average, standard deviation (estimate and actual):**
  - Average Estimate: 2h 01m
  - Average Actual: 2h 06m
  - Standard Deviation Estimate: 2h 10m
  - Standard Deviation Actual: 2h 17m

- **Total task estimation error ratio: (sum of total hours estimation / sum of total hours spent) - 1:**
  - 0.04

## QUALITY MEASURES

- **Unit Testing:**
  - **Total hours estimated:** 9h
  - **Total hours spent:** 8h 15m
  - **Nr of automated unit test cases:** 237
  - **Coverage (if available):** 82.3%
- **E2E testing:**
  - **Total hours estimated:** 9h
  - **Total hours spent:** 9h 50m
- **Code review:**
  - **Total hours estimated:** 2h 30m
  - **Total hours spent:** 2h 20m
- **Technical Debt management:**
  - **Total hours estimated:** 3h (code smells + coverage + bugs + security hotspots issues)
  - **Total hours spent:** 2h 30m
  - **Hours estimated for remediation by SonarQube:**  (all code smells)
  - **Hours estimated for remediation by SonarQube only for the selected and planned issues:** 
  - **Hours spent on remediation:** 
  - **debt ratio (as reported by SonarQube under "Measures-Maintainability"):** was , now %
  - **rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):**
    - Reliability: was , now 
    - Security: was , now 
    - Maintainability: was , now 

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
