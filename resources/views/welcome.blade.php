<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>FlashcardStorm</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link href="{{ asset('facss/css/all.css') }}" rel="stylesheet">
        <link rel="icon" type="image/png" href="{{asset('images/favicon.png')}}" />
        <!-- Hotjar Tracking Code for https://flashcardstorm.herokuapp.com/ -->
        <script async>
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:1693062,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        </script>
    </head>
    <body>
        <div id="app"></div>
    </body>
    <script async src="{{ asset('js/app.js') }}"></script>
</html>
