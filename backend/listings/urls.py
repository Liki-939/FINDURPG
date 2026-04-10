from django.urls import path
from .views import (
    create_listing,
    get_all_listings,
    get_my_listings,
    approve_listing,
    get_pending_listings,
    reject_listing,
    delete_listing
)

urlpatterns = [
    path('create/', create_listing),
    path('all/', get_all_listings),
    path('mine/', get_my_listings),
    path('<int:listing_id>/', delete_listing),

    # ADMIN ROUTES
    path('approve/<int:listing_id>/', approve_listing),
    path('pending/', get_pending_listings),
    path('reject/<int:listing_id>/', reject_listing),
]