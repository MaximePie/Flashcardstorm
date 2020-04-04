

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

## ScheduledRandomQuestions returns nothing if provided array contains all questions ids
Expected : 2 scheduled questions
Unexpected : 1 scheduled question whose id is in the array

## Question Message returns a message with the next question date
Expected : Vous avez répondu à toutes vos questions pour aujourd'hui.

La prochaine question sera prévue pour le " . $next_question->next_question_at
Check User::NEXT_QUESTION_MESSAGE

## Question Message returns a message when no question is scheduled
Expected : Aucune question ne vous est assignée pour le moment. Passez en mode Tempête pour ajouter
automatiquement les questions à votre Kit

Check User::NEXT_QUESTION_MESSAGE_NOT_FOUND

## RandomQuestion returns users questions on user mode

Expected : Only questions assigned to the user
Unexpected : Questions non assigned to the user

## RandomQuestion returns any question on "guest mode"

Expected : Only questions assigned to the user
Unexpected : Questions non assigned to the user

## Test submit with success.

## Test to fetch the list of the questions as connected user.

## Test to fetch the list of the questions as guest.

## Test to submit an answer with only one remaining daily objective occurrence.

## Test that creating a changelog also creates a notification and sends it to users

## Test that the reverted question is also assigned to a user when he selects a question.