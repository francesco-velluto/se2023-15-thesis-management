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
|   #0   |    16   |   -    |  50h 35m   |   51h 15m    |
|   #1   |    6    |   5    |     8h     |   9h 10m     |
|   #2   |    8    |   8    |    16h     |   18h 20m    |
|   #3   |    6    |   3    |     7h     |   6h 05m     |
|   #4   |    3    |   3    |     4h     |     4h       |
|   #5   |    7    |   8    |  10h 30m   |   11h 25m    |
| TOTAL  |    46   |   27   |  96h 05m   |   100h 15m   |


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
  - **Hours estimated for remediation by SonarQube:** 11h (all code smells)
  - **Hours estimated for remediation by SonarQube only for the selected and planned issues:** 5h 56m
  - **Hours spent on remediation:** 2h 30m
  - **debt ratio (as reported by SonarQube under "Measures-Maintainability"):** was 0.2%, now 0.1%
  - **rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):**
    - Reliability: was A, now A
    - Security: was A, now A
    - Maintainability: was A, now A

## ASSESSMENT

- What caused your errors in estimation (if any)?
    - We found some estimation errors due to end to end tests because we had to reimplement some of them after changes in the front-end side.
    
- What lessons did you learn (both positive and negative) in this sprint?
    - good 😌 We discovered that Telegram surveys are a very useful tool to quickly and easily decide on the implementation of a simple feature.    
    - good 😌 Planning some time for general bug fixing and/or UX improvements is a good idea, as it allows us to improve the quality of the product and to avoid accumulating technical debt, especially after the implementation of new user stories.
    - bad  😕 We should have waited for the very end of implementation to start writing the tests, as we had to rewrite some of them after changes in the front-end side.
    - bad  😕 We should have performed code review before testing because it had revealed some bugs that are a problem for who was implementing tests.

- Which improvement goals set in the previous retrospective were you able to achieve?
    - We managed to maintain a high quality of the product, with a low number of bugs and code smells, with an increment of the number of story points committed.
    - We also managed to consult the FAQ document more often in order not to loose some specifications about the user stories we commited and not to waste time in the correction of features.


- Which ones you were not able to achieve? Why?
    - None.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - We will try to plan a  shared task to perform a functional review of the entire application, in order to find any bugs or UX improvements that we may have missed.
     
    

- One thing you are proud of as a Team!!
    - Even if we had small relations and communication problems we managed to overcome them without loosing the focus on the quality of the team work. 💜
