

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

## Expected : 1 question for in 3 days but not memorzed
Unwanted : 1 question for the next day but memorized

## Delete users questions before going further
Expected : No question
Unwanted : One question but next question at has already passed

## Test submit with success.

## Test to fetch the list of the questions as connected user.

## Test to fetch the list of the questions as guest.

## Test to submit an answer with only one remaining daily objective occurrence.

## Test that creating a changelog also creates a notification and sends it to users

## Test that the reverted question is also assigned to a user when he selects a question.