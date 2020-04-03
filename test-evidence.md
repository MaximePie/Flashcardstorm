

# Documentation

## Question Message returns a message with the next question date
Expected : Vous avez répondu à toutes vos questions pour aujourd'hui.

La prochaine question sera prévue pour le " . $next_question->next_question_at
Check User::NEXT_QUESTION_MESSAGE

## Question Message returns a message when no question is scheduled
Expected : Aucune question ne vous est assignée pour le moment. Passez en mode Tempête pour ajouter
automatiquement les questions à votre Kit

Check User::NEXT_QUESTION_MESSAGE_NOT_FOUND