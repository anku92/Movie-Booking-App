from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from django.core import validators


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "username",
            "password",
            "email",
            "mobile_number",
            "date_of_birth",
            "address",
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
    )

    class Meta:
        model = User
        fields = (
            "name",
            "email",
            "username",
            "password",
            "mobile_number",
            "date_of_birth",
            "address",
        )

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.mobile_number = validated_data.get(
            "mobile_number", instance.mobile_number
        )
        instance.date_of_birth = validated_data.get(
            "date_of_birth", instance.date_of_birth
        )
        instance.address = validated_data.get("address", instance.address)
        password = validated_data.get("password")
        if password:
            instance.set_password(password)

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


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"


class CinemaSerializer(serializers.ModelSerializer):
    movies = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all(), many=True, required=False)
    class Meta:
        model = Cinema
        fields = "__all__"


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            "id",  # Include 'id' if you want to serialize the primary key
            "user",
            "cinema",
            "movie",
            "seats",
            "num_seats",
            "schedule",
            "show_date",
            "ticket_price",
        ]
        read_only_fields = ["id", "user"]
