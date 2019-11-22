<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>FlashcardStorm</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link href="{{ asset('facss/css/all.css') }}" rel="stylesheet">
    </head>
    <body>
        <div id="app"></div>
    </body>
    <script src="{{ asset('js/app.js') }}"></script>
</html>