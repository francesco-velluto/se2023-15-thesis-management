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
  we committed to do 7 stories and we did 3 stories, in order of business priority
  - Insert proposal
  - Search proposals
  - Apply for proposals

- **Total points committed vs. done:**
  we committed to do 26 points and we have done 15 points

- **Nr of hours planned vs. spent (as a team):**
  we planned to spend 95h 50m hours (around 16 hours for each one of the 6 team members)
  and we spent 110h 20m

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   28    |        |    61h 15m     |   76h 05m    |
| _#1_   |    7    |   5    |   11h 15m  |   14h 55m    |
| _#2_   |    7    |   8    |   9h 15m  |  15h 45m     |
| _#3_   |    7    |   2    |    3h 20m  |   5h 35m     |

- **Hours per task average, standard deviation (estimate and actual):**
  - Average Estimate: 1h 46m
  - Average Actual: 2h 17m
  - Standard Deviation Estimate: 1h 30m
  - Standard Deviation Actual: 1h 53m

- **Total task estimation error ratio: (sum of total hours estimation / sum of total hours spent) - 1:**
  - 0.24


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
  - We first estimated time for each task and after we assigned them to members. Tasks estimation depends on people's experiences and skills.
  - We didn't consider bug fix time and merge conflicts resolution during estimation.
  - Login implementation task was an epic and we only estimated 3h as a task but it took 11h.
  - We didn't estimate time for redesign of frontend pages.
  - Story points during this sprint were very different in value with respect to the ones from the demo project so we understimated time for tasks.

- What lessons did you learn (both positive and negative) in this sprint?
  - We should create more coherent design for the frontend because pages designed and developed by different people had very different styles.
  - We should reuse common React components between pages instead of recreating them many times by several people and then choose one of them.
  - We learned that Telegram chat and Daily SCRUMS were a good means for fast communication and organization.
  - We learned that a complete and clear documentation helps us to understand faster how to use tools implemented by other team members.


- Which improvement goals set in the previous retrospective were you able to achieve?
  - We estimated time for code review.
  - We prepared both presentation and retrospective speech.
  - We better distributed tasks per type for each team member.
  - We provided a clear code template to efffectively test and run the code.
  - We spent more time than in the first sprint in planning.
  
- Which ones you were not able to achieve? Why?
  - We didn't estimate extra time for modifications in case of bugs because we understimated the time needed for almost every task so there were quite no time for bug fixing.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - We need a better time estimation and we will achieve it by estimating the time for task after having assigned them to people, in order to match his/her experiences and skills.
  - Keep the frontend coherent in style from the beginning, we can achieve it by assigning the designs tasks always at the same person.

- One thing you are proud of as a Team!!
  - We are very flexible in term of swapping tasks in case someone needs help.