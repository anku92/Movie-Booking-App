from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator



class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Username should be provided")

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    username = models.CharField(max_length=30, unique=True, validators=[MinLengthValidator(5)])
    email = models.EmailField(max_length=254, unique=True)
    mobile_regex = RegexValidator(
        regex=r"^\d{10}$",
        message="Mobile number must be 10 digits.",
    )
    mobile = models.CharField(
        validators=[mobile_regex], max_length=12, blank=True
    )

    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    favorite_cinemas = models.ManyToManyField('Cinema', blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    objects = UserManager()

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name
    
    def toggle_favorite_cinema(self, cinema_ids):
        cinemas_to_add = Cinema.objects.filter(pk__in=cinema_ids)
        cinemas_to_remove = self.favorite_cinemas.filter(pk__in=cinema_ids)
        
        for cinema in cinemas_to_add:
            self.favorite_cinemas.add(cinema)
        
        for cinema in cinemas_to_remove:
            self.favorite_cinemas.remove(cinema)
        
        added_ids = cinemas_to_add.values_list('pk', flat=True)
        removed_ids = cinemas_to_remove.values_list('pk', flat=True)
        
        message_parts = []
        if added_ids:
            message_parts.append(f"Cinemas {', '.join(map(str, added_ids))} added to favorites.")
        if removed_ids:
            message_parts.append(f"Cinemas {', '.join(map(str, removed_ids))} removed from favorites.")
        
        return ' '.join(message_parts)

# -----------------------------------------------------------------------------------


class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, validators=[MinLengthValidator(3)])
    description = models.TextField( validators=[MinLengthValidator(20)])
    release_date = models.DateField()
    genre = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    duration = models.IntegerField(validators=[MinValueValidator(30), MaxValueValidator(200)])
    poster = models.URLField(max_length=200)
    rating = models.FloatField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    starring_actor = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    director = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    language = models.CharField(max_length=50, validators=[MinLengthValidator(3)])
    tomato_meter = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])
    audience_meter = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])

    def __str__(self):
        return self.title


class Cinema(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    location = models.TextField()
    movies = models.ManyToManyField(Movie, related_name='cinemas')

    def __str__(self):
        return self.name


class Ticket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_tickets")
    cinema = models.CharField(max_length=100)
    movie = models.CharField(max_length=50)
    seats = models.JSONField()
    num_seats = models.IntegerField(validators=[MinValueValidator(1)])
    schedule = models.TimeField()
    show_date = models.DateField()
    ticket_price = models.FloatField(validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.movie} Ticket - {self.user.username}"