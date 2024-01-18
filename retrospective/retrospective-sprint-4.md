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
  - Average Estimate: 2h 35m
  - Average Actual: 2h 42m
  - Standard Deviation Estimate: 2h 39m
  - Standard Deviation Actual: 2h 45m

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