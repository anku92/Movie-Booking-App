from django.urls import path
from .views import *

urlpatterns = [
    path("movies/", MovieList.as_view(), name="movie-list"),
    path("movie/add/", MovieView.as_view(), name="add-movie"),
    path("movies/<int:pk>/", UpdateMovieView.as_view(), name="update-delete-movie"),
    path("movies/filter/", MovieFilterAPI.as_view(), name="movie-filter"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("signup/", UserCreateView.as_view(), name="user-signup"),
    path("users/<int:pk>/", UserView.as_view(), name="update-delete-user"),
    path("login/", LoginView.as_view(), name="login"),
    path("cinemas/", CinemaView.as_view(), name="all-cinemas"),
    path('cinema/add/', AddCinemaView.as_view(), name='add_cinema'),
    path('cinemas/<int:cinema_id>/', UpdateCinemaView.as_view(), name='update_cinema'),
    path('ticket/add/', TicketCreateView.as_view(), name='create_ticket'),]
