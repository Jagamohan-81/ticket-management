# Generated by Django 4.2.7 on 2023-11-29 07:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_ticket_previous_ticket'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='previous_ticket',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.ticket'),
        ),
    ]
