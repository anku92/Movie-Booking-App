from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from django.core import validators


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"


class CinemaSerializer(serializers.ModelSerializer):
    movies = serializers.PrimaryKeyRelatedField(
        queryset=Movie.objects.all(), many=True, required=False
    )

    class Meta:
        model = Cinema
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    favorite_cinemas = CinemaSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "username",
            "password",
            "email",
            "mobile",
            "date_of_birth",
            "address",
            "favorite_cinemas",
            "is_staff",
            "is_superuser",
        )

    def validate_password(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "Password must be at least 5 characters long."
            )
        if len(value) > 12:
            raise serializers.ValidationError(
                "Password max limit is 12 characters long."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        validators=[
            validators.MinLengthValidator(5),
            validators.MaxLengthValidator(12),
        ],
        required=False,
    )

    class Meta:
        model = User
        fields = (
            "name",
            "email",
            "username",
            "password",
            "mobile",
            "date_of_birth",
            "address",
            "is_staff",
            "is_superuser",
        )
        # Add the following line to make fields not required
        extra_kwargs = {
            "name": {"required": False},
            "email": {"required": False},
            "username": {"required": False},
        }

    def update(self, instance, validated_data):
        for field in self.Meta.fields:
            value = validated_data.get(field)
            if value is not None:
                # Handle password separately to use set_password
                if field == "password":
                    instance.set_password(value)
                else:
                    setattr(instance, field, value)

        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return {"user": user}
        raise serializers.ValidationError("Invalid credentials")


class SuperuserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = UserSerializer.Meta.fields
        extra_fields = ("is_superuser", "is_staff")


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            "id",
            "cinema",
            "movie",
            "seats",
            "num_seats",
            "schedule",
            "show_date",
            "ticket_price",
            "user",
        ]
