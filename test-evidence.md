

# Documentation

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