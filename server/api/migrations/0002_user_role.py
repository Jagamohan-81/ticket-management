# Generated by Django 4.2.7 on 2023-11-16 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('T', 'Teacher'), ('S', 'Student')], default=1, max_length=1),
            preserve_default=False,
        ),
    ]
