from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token


from api.urls import router

admin.autodiscover()
admin.site.enable_nav_sidebar = False

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('rest/', include('rest_framework.urls')),
                  path('', include(router.urls)),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path('auth/', obtain_auth_token)
]

if settings.ENV == "LOCAL":
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]