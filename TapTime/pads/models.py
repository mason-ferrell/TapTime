from django.db import models

# Create your models here.
class Sample(models.Model):
    sample_name = models.CharField(max_length=30)
    sample_url = models.URLField(max_length=100)