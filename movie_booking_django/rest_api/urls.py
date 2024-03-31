from django.urls import path
from .views import *

urlpatterns = [
    path("movies/", MovieList.as_view(), name="movie-list"),
    path("movie/add/", MovieView.as_view(), name="add-movie"),
    path("movies/<int:pk>/", UpdateMovieView.as_view(), name="update-del-movie"),
    path("movies/filter/", MovieFilterAPI.as_view(), name="movie-filter"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("signup/", UserCreateView.as_view(), name="user-signup"),
    path("users/<int:pk>/", UserView.as_view(), name="update-del-user"),
    path("login/", LoginView.as_view(), name="login"),
    path("cinemas/", CinemaView.as_view(), name="all-cinemas"),
    path("cinema/add/", AddCinemaView.as_view(), name="add-cinema"),
    path("cinemas/<int:cinema_id>/", UpdateCinemaView.as_view(), name="update-cinema"),
    path("ticket/add/", TicketCreateView.as_view(), name="create-ticket"),
    path("users/<int:user_id>/tickets/", UserTicketListView.as_view(), name="view-ticket"),
    path("users/<int:user_id>/tickets/<int:ticket_id>/", UserTicketDelete.as_view(), name="delete-ticket"),
    path('users/<int:user_id>/toggle/', UpdateFavoriteCinemas.as_view(), name='update-favorite-cinemas'),

]
