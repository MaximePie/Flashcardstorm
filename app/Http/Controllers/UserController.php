<?php

namespace App\Http\Controllers;

use App\Category;
use App\Question;
use App\Question_user;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();

            return $next($request);
        });
    }

    protected function index(): JsonResponse
    {
        $users = User::query()->orderBy('score', 'desc')->get();

        return response()->json(['users' => $users]);
    }

    /**
     * Show user statistics
     *
     * @return JsonResponse
     */
    protected function showStatistics(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user) {
            return response()->json([
                'statistics' => $user->statistics,
            ]);
        }

        return response()->json([
            'error' => "L'utilisateur n'est pas connecté."
        ]);
    }

    /**
     * Show user achievements
     *
     * @return JsonResponse
     */
    protected function showAchievements(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user) {

            return response()->json([
                'objectives' => $user->achievements(),
            ]);
        }

        return response()->json([
            'error' => "L'utilisateur n'est pas connecté."
        ]);
    }


    /**
     * Show user dailyObjective
     *
     * @return JsonResponse
     */
    protected function showDailyObjective(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user) {
            return response()->json([
                'dailyObjectiveData' => $user->dailyQuestions()->count(),
            ]);
        }

        return response()->json([
            'error' => "L'utilisateur n'est pas connecté."
        ]);
    }

    /**
     * @return JsonResponse
     */
    protected function me(): JsonResponse
    {
        return response()->json([
            'user' => Auth::user(),
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @return JsonResponse
     */
    protected function score(): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            return response()->json([
                'score' => $user->score,
                'number_of_new_changelogs' => $user->unreadNotifications()->count(),
                'number_of_questions' => $user->dailyQuestions()->count(),
                'numberOfMentalQuestions' => $user->dailyMentalQuestions()->count(),
                'userId' => $user->id,
            ]);
        }
    }


    /**
     * Returns the distribution of the user based on his categories
     *
     * @return JsonResponse
     */
    protected function radarDistribution(): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            $categories = Category::All()->whereIn('id', $user->questions()->pluck('category_id'));
            $accomplishedQuestionsData = [];
            $previewedQuestionsData = [];
            $captions = [];

            foreach ($categories as $category) {
                $numberOfUserQuestionsInThisCategory = $user
                    ->questions()
                    ->where('questions.category_id', $category->id)
                    ->count();
                $numberOfMemorizedQuestionsInThisCategory = $user
                    ->memorizedQuestions()
                    ->where('questions.category_id', $category->id)
                    ->whereNull('questions.reverse_question_id')
                    ->count();
                $numberOfQuestionsInThisCategory = Question::where('category_id', $category->id)
                    ->count();
                if ($numberOfUserQuestionsInThisCategory) {
                    $category['index'] = $numberOfMemorizedQuestionsInThisCategory / 1000;
                    $accomplishedQuestionsData[$category->name] = $category['index'];
                    $category['index'] = $numberOfUserQuestionsInThisCategory / 1000;
                    $previewedQuestionsData[$category->name] = $category['index'];
                    $captions[$category->name] = $category->name . '( ' . $numberOfMemorizedQuestionsInThisCategory . ' )';
                }
            }
            $formatedAchievedData = [
                "data" => $accomplishedQuestionsData,
                "meta" => ["color" => 'blue'],
            ];

            $formatedPreviewedData = [
                "data" => $previewedQuestionsData,
                "meta" => ["color" => 'orange'],
            ];

            return response()->json([
                "radarData" => [$formatedAchievedData, $formatedPreviewedData],
                "captionsData" => $captions,
            ]);
        }
    }

    /**
     * Returns the progress of the user.
     *
     * @return JsonResponse
     */
    protected function updateProgress(): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            if ($user->last_daily_updated_at === null || !now()->isSameDay($user->last_daily_updated_at)) {
                $user->last_daily_updated_at = now();
                $user->daily_objective = $user->dailyQuestions()->count();
                $user->daily_progress = 0;
                $user->save();
            }

            return response()->json([
                'userProgress' => $user->dailyProgress(),
                'userMentalProgress' => $user->dailyMentalQuestions()->count(),
                'statistics' => $user->statistics,
            ]);
        }
    }

    /**
     * Get the memorized questions of the connected User
     * @return JsonResponse
     */
    protected function memorizedQuestionsForConnectedUser(): ?JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            /** @var Question[] $memorizedQuestions */
            $memorizedQuestions = $user->questions()->get();
            foreach ($memorizedQuestions as $question) {
                $question['answer'] = $question->answer()->first()->wording;
                $question['isMemorized'] = $question->isMemorizedForUser($user);
                $question['questionUser'] = Question_user::findFromTuple($question->id, $user->id)->first();
                $question['current_delay'] = $question['questionUser']->current_delay;
            }

            return response()->json([
                'memorizedQuestions' => $memorizedQuestions,
            ]);
        }
    }
}
