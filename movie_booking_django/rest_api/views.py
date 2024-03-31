from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser, AllowAny
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from .permissions import IsAdminOrSelf
from django.core.exceptions import ObjectDoesNotExist


# ---------------------- MOVIE VIEW BELOW----------------------
class MovieList(APIView):
    def get(self, request):
        movies = Movie.objects.all()
        serialized = MovieSerializer(movies, many=True).data
        return Response(serialized, status=status.HTTP_200_OK)


class MovieView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        data = request.data
        serialized = MovieSerializer(data=data)
        if serialized.is_valid():
            serialized.save()
            return Response(
                {"Movie added": serialized.data}, status=status.HTTP_201_CREATED
            )
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateMovieView(APIView):
    permission_classes = [IsAdminUser | AllowAny]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        movie = get_object_or_404(Movie, pk=pk)
        serialized = MovieSerializer(movie)
        return Response(serialized.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        movie = get_object_or_404(Movie, pk=pk)
        serialized = MovieSerializer(movie, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response({"Movie updated": request.data}, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        movie = get_object_or_404(Movie, pk=pk)
        movie.delete()
        return Response({"message": "Movie deleted"}, status=status.HTTP_204_NO_CONTENT)


class MovieFilterAPI(APIView):
    def get(self, request):
        keyword = request.GET.get("keyword", None)
        cinema_name = request.GET.get("cinema", None)
        city = request.GET.get("city", None)
        genre = request.GET.get("genre", None)

        if not cinema_name and not city:
            movies = Movie.objects.filter(
                (Q(title__icontains=keyword) if keyword else Q())
                & (Q(genre__icontains=genre) if genre else Q())
            )

            cinema_ids = []
            for movie in movies:
                cinema_ids.extend(movie.cinemas.values_list("id", flat=True))

            cinemas = Cinema.objects.filter(id__in=cinema_ids)
            serialized_movies = []
            for movie in movies:
                serialized_movie = MovieSerializer(movie).data
                serialized_movie["cinemas"] = CinemaSerializer(
                    movie.cinemas.all(), many=True
                ).data
                serialized_movies.append(serialized_movie)

            return Response(
                {"movies": serialized_movies},
                status=status.HTTP_200_OK,
            )
        else:
            cinemas = Cinema.objects.filter(
                Q(city__icontains=city) if city else Q(),
                Q(name__icontains=cinema_name) if cinema_name else Q(),
            )

            movie_ids = []
            for cinema in cinemas:
                movie_ids.extend(cinema.movies.values_list("id", flat=True))

            movies = Movie.objects.filter(
                (
                    Q(id__in=movie_ids)
                    & (Q(title__icontains=keyword) if keyword else Q())
                )
                & (Q(genre__icontains=genre) if genre else Q())
            )
            serialized_movies = MovieSerializer(movies, many=True).data

            serialized_cinemas = []
            for cinema in cinemas:
                serialized_cinema = CinemaSerializer(cinema).data
                serialized_cinema["movies"] = serialized_movies
                serialized_cinemas.append(serialized_cinema)
            return Response({"cinemas": serialized_cinemas}, status=status.HTTP_200_OK)


# # ---------------------- CINEMA VIEW BELOW ----------------------
class CinemaView(APIView):
    def get(self, request):
        cinemas = Cinema.objects.all()
        serialized = CinemaSerializer(cinemas, many=True).data
        return Response(serialized, status=status.HTTP_200_OK)


class AddCinemaView(APIView):
    def post(self, request):
        data = request.data
        serialized = CinemaSerializer(data=data)

        if serialized.is_valid():
            cinema_instance = serialized.save()
            return Response({"added": serialized.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCinemaView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, cinema_id):
        cinema = get_object_or_404(Cinema, id=cinema_id)
        serialized = CinemaSerializer(cinema)
        return Response(serialized.data, status=status.HTTP_200_OK)

    def put(self, request, cinema_id):
        cinema = get_object_or_404(Cinema, id=cinema_id)
        serialized_cinema = CinemaSerializer(cinema, data=request.data, partial=True)

        if serialized_cinema.is_valid():
            cinema.__dict__.update(serialized_cinema.validated_data)
            cinema.save()
            return Response(
                {"Cinema updated": request.data},
                status=status.HTTP_200_OK
            )

        return Response(
            {"update failed": serialized_cinema.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, cinema_id):
        cinema = get_object_or_404(Cinema, id=cinema_id)
        cinema.delete()
        return Response({"message": "Cinema deleted"},status=status.HTTP_204_NO_CONTENT)


# # ---------------------- USER VIEW BELOW ----------------------
class UserListView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserCreateView(APIView):
    def post(self, request):
        is_staff = request.data.get("is_staff", False)
        is_superuser = request.data.get("is_superuser", False)

        if is_staff != is_superuser:
            # If is_staff and is_superuser are not both True or both False
            return Response(
                {"error": "is_staff & is_superuser, both should be True or both False"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if is_superuser and is_staff:
            serializer = SuperuserSerializer(data=request.data)
        else:
            serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileUpdateSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdminOrSelf]

    def delete(self, request, pk):
        response = self.destroy(request, pk)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            message = {"detail": "User deleted successfully."}
            response.data = message
        return response

    def put(self, request, pk):
        response = self.update(request, pk)
        if response.status_code == status.HTTP_200_OK:
            message = {"detail": "User updated successfully."}
            response.data = request.data
        return response


class UpdateFavoriteCinemas(APIView):
    def put(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        cinema_ids = request.data.get('favorite_cinemas', [])

        message = user.toggle_favorite_cinema(cinema_ids)
        user.save()

        return Response({"message": message}, status=status.HTTP_200_OK)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": int(user.id),
                "favorite_cinemas": user.favorite_cinemas.values()
            }
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


# # ---------------------- TICKET VIEW BELOW ----------------------
class TicketCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        serializer = TicketSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class UserTicketListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        tickets = Ticket.objects.filter(user_id=user_id)
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)
    

class UserTicketDelete(APIView):
    def delete(self, request, user_id, ticket_id):
        ticket = get_object_or_404(Ticket, id=ticket_id, user_id=user_id)
        ticket.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)