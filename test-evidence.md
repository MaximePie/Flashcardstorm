

# Documentation

## A basic test example.

## A basic test example.

## Test submit with success.

## Test create a reverted question for the current question.

## Try to memorize a question while having a score UNDER the threshold
Expected : Exception "Cannot memorize, threshold not reached"
Unwanted : No exception and the question is memorized anyway

## Try to memorize a question while having a score SUPERIOR THAN the threshold
Expected : The User_Question is well memorized

## isSetForUser() is TRUE if the question is assigned to the user
Expected : isSetForUser() should return true

## isSetForUser() is FALSE if the question is not assigned to the user
Expected : isSetForUser() should return false

## Prepared question has the correct answers
Expected : The answer wording of the question

## Prepared question has the attribute is_new if it is NOT set for user
Expected : The attribute is_new is set to TRUE

## Prepared question has NOT the attribute is_new if it is set for user
Expected : The attribute is_new is set to FALSE

## Prepared question has NOT the attribute is_new if no user is provided
Expected : The attribute is_new is set to FALSE

## Prepared question matches all the additional answers
Expected : All the additional answers in additional_answers attribute

## Prepared question has empty additional answers if they are no additional answers available
Expected : Additional answers attribute should be NULL

## Prepared question returns the appropriate category
Expected : The category of the question

## Prepared question category is null if there are no category assigned to the question
Unexpected : A category

## Save success updates the appropriate fields for soft mode
Expected : UserScore is equal to full_score before it is updated
Expected : CurrentDelay is incremented
Expected : LastAnswerAt is set to now
Expected : NextQuestionAt is set to now + current delay
Expected : $expectedFullScore is set to the new current delay times the question base score

## Save success memorizes a question if its full score is greater than 100
Expected : isMemorized is true

## Save success add 10 points on storm mode
Expected : user score is augmented by 10

## Save success with golden card attribute
Expected : earned points is multiplied itself

## Save success with golden card attribute set to FALSE should not increase earned points
Expected : earned points is left by itself
Unexpected : earned points is multiplied by itself

## A new question_user has its full_score automatically set to its score
Expected : Full score is equal to score

## addStatistics creates a new statistics row if no statistics row already exists for this day
Expected : A new statistics row for the user, matching the current day
Unexpected : Any previous statistics row with a different date than today, but incremented

## addStatistics updates the current row if there is already an existing row matching the current day
Unexpected : A new statistics row for the user, matching the current day
Expected : The current, but incremented

## Expected : 1 question scheduled for in 1 day
Unwanted : 1 question scheduled for in 3 day

## Expected : 1 question for in 3 days but not memorzed

Unwanted : 1 question for the next day but memorized

## Delete users questions before going further
Expected : No question

Unwanted : One question but next question at has already passed

## DailyQuestion does not return incoming questions
Expected : Empty

Unwanted : A question with next_question_at scheduled for later than now

## DailyQuestion does not return memorizedQuestions
Expected : Empty

Unwanted : A memorized question

## DailyQuestion returns non memorized and scheduled for now questions
Expected : A scheduled question non memorized

Unwanted : A memorized question

## Scheduled random question returns one or more questions
Expected : 2 Scheduled questions

## A scheduled random question takes an empty array as parameters and returns all questions
Expected : 2 scheduled questions
Unexpected : More or less questions

## A scheduled random question takes an array of already loaded questions and doesn't return it but
returns other questions
Expected : 2 scheduled questions
Unexpected : 1 scheduled question whose id is in the array

## RandomQuestion returns nothing if provided array contains all questions ids
Expected : 2 scheduled questions
Unexpected : 1 scheduled question whose id is in the array

## RandomQuestion returns any question if no user is provided
Expected : A question not set for the User

## RandomQuestion returns any question if
There is a user
He is in storm mode
Expected : A question not set for the User

## Question Message returns a message with the next question date
Expected : Vous avez répondu à toutes vos questions pour aujourd'hui.

La prochaine question sera prévue pour le " . $next_question->next_question_at
Check User::NEXT_QUESTION_MESSAGE

## Question Message returns a message when no question is scheduled
Expected : Aucune question ne vous est assignée pour le moment. Passez en mode Tempête pour ajouter
automatiquement les questions à votre Kit

Check User::NEXT_QUESTION_MESSAGE_NOT_FOUND

## Question Message returns a message when in storm mode but no question has been found
Expected : Il n'y a pas de question disponible, vous pouvez en créer en cliquant sur Ajouter des Questions

Check User::NEXT_QUESTION_MESSAGE_NOT_FOUND

## UpdateDailyProgress sets the appropriate value on daily objective and progress
Expected : Daily Progress is up to date

## Test submit with success.

## Test to fetch the list of the questions as connected user.

## Test to fetch the list of the questions as guest.

## Test to submit an answer with only one remaining daily objective occurrence.

## Test that creating a changelog also creates a notification and sends it to users

## Test that the reverted question is also assigned to a user when he selects a question.