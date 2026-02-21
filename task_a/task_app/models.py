from django.db import models
from  django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    role = (
        ("admin", "Admin"),
        ("user", "User"),
    )
    role=models.CharField(choices=role,default='user')

    def __str__(self):
        return self.username
    


